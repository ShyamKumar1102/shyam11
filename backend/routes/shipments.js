const express = require('express');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, ScanCommand, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

// Generate tracking number
const generateTrackingNumber = () => {
  const prefix = 'TRK';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${timestamp}${random}`;
};

// Get all shipments
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: process.env.SHIPMENTS_TABLE
    }));
    res.json(result.Items || []);
  } catch (error) {
    console.error('Error fetching shipments:', error);
    res.status(500).json({ error: 'Failed to fetch shipments' });
  }
});

// Get single shipment
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: process.env.SHIPMENTS_TABLE,
      Key: { id: req.params.id }
    }));
    
    if (result.Item) {
      res.json(result.Item);
    } else {
      res.status(404).json({ error: 'Shipment not found' });
    }
  } catch (error) {
    console.error('Error fetching shipment:', error);
    res.status(500).json({ error: 'Failed to fetch shipment' });
  }
});

// Get shipment by tracking number
router.get('/track/:trackingNumber', authenticateToken, async (req, res) => {
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: process.env.SHIPMENTS_TABLE,
      FilterExpression: 'trackingNumber = :trackingNumber',
      ExpressionAttributeValues: {
        ':trackingNumber': req.params.trackingNumber
      }
    }));
    
    if (result.Items && result.Items.length > 0) {
      res.json(result.Items[0]);
    } else {
      res.status(404).json({ error: 'Shipment not found' });
    }
  } catch (error) {
    console.error('Error tracking shipment:', error);
    res.status(500).json({ error: 'Failed to track shipment' });
  }
});

// Get shipments by order
router.get('/order/:orderId', authenticateToken, async (req, res) => {
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: process.env.SHIPMENTS_TABLE,
      FilterExpression: 'orderId = :orderId',
      ExpressionAttributeValues: {
        ':orderId': req.params.orderId
      }
    }));
    
    res.json(result.Items || []);
  } catch (error) {
    console.error('Error fetching shipments by order:', error);
    res.status(500).json({ error: 'Failed to fetch shipments' });
  }
});

// Create shipment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { orderId, courierId, courierName, customerName, customerAddress, customerPhone, items, estimatedDelivery } = req.body;
    
    const shipment = {
      id: Date.now().toString(),
      orderId,
      courierId,
      courierName,
      trackingNumber: generateTrackingNumber(),
      customerName,
      customerAddress,
      customerPhone,
      items: items || [],
      status: 'Pending',
      shipmentDate: new Date().toISOString().split('T')[0],
      estimatedDelivery: estimatedDelivery || null,
      pickupDate: null,
      deliveryDate: null,
      createdAt: new Date().toISOString()
    };

    await docClient.send(new PutCommand({
      TableName: process.env.SHIPMENTS_TABLE,
      Item: shipment
    }));

    res.status(201).json(shipment);
  } catch (error) {
    console.error('Error creating shipment:', error);
    res.status(500).json({ error: 'Failed to create shipment' });
  }
});

// Update shipment status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status, pickupDate, deliveryDate } = req.body;
    
    let updateExpression = 'SET #status = :status, updatedAt = :updatedAt';
    const expressionAttributeNames = { '#status': 'status' };
    const expressionAttributeValues = {
      ':status': status,
      ':updatedAt': new Date().toISOString()
    };

    if (pickupDate) {
      updateExpression += ', pickupDate = :pickupDate';
      expressionAttributeValues[':pickupDate'] = pickupDate;
    }

    if (deliveryDate) {
      updateExpression += ', deliveryDate = :deliveryDate';
      expressionAttributeValues[':deliveryDate'] = deliveryDate;
    }

    const result = await docClient.send(new UpdateCommand({
      TableName: process.env.SHIPMENTS_TABLE,
      Key: { id: req.params.id },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    }));

    // Update dispatch status based on shipment status
    if (req.params.id) {
      try {
        const dispatchResult = await docClient.send(new ScanCommand({
          TableName: process.env.DISPATCH_TABLE,
          FilterExpression: 'shipmentId = :shipmentId',
          ExpressionAttributeValues: { ':shipmentId': req.params.id }
        }));

        if (dispatchResult.Items?.length > 0) {
          const dispatchStatus = status === 'Delivered' ? 'Delivered' : 
                                status === 'Pending' ? 'Pending' : 'In Transit';
          
          const dispatch = dispatchResult.Items[0];
          await docClient.send(new UpdateCommand({
            TableName: process.env.DISPATCH_TABLE,
            Key: { dispatchId: dispatch.dispatchId },
            UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
            ExpressionAttributeNames: { '#status': 'status' },
            ExpressionAttributeValues: {
              ':status': dispatchStatus,
              ':updatedAt': new Date().toISOString()
            }
          }));
        }
      } catch (dispatchError) {
        console.error('Error updating dispatch status:', dispatchError);
      }
    }

    res.json(result.Attributes);
  } catch (error) {
    console.error('Error updating shipment status:', error);
    res.status(500).json({ error: 'Failed to update shipment status' });
  }
});

// Update shipment
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { courierId, courierName, customerAddress, customerPhone, estimatedDelivery } = req.body;
    
    const result = await docClient.send(new UpdateCommand({
      TableName: process.env.SHIPMENTS_TABLE,
      Key: { id: req.params.id },
      UpdateExpression: 'SET courierId = :courierId, courierName = :courierName, customerAddress = :customerAddress, customerPhone = :customerPhone, estimatedDelivery = :estimatedDelivery, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':courierId': courierId,
        ':courierName': courierName,
        ':customerAddress': customerAddress,
        ':customerPhone': customerPhone,
        ':estimatedDelivery': estimatedDelivery,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    }));

    res.json(result.Attributes);
  } catch (error) {
    console.error('Error updating shipment:', error);
    res.status(500).json({ error: 'Failed to update shipment' });
  }
});

module.exports = router;
