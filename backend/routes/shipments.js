const express = require('express');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);
const SHIPMENTS_TABLE = process.env.SHIPMENTS_TABLE || 'inventory-shipments';

// Get all shipments
router.get('/', async (req, res) => {
  try {
    const command = new ScanCommand({
      TableName: SHIPMENTS_TABLE,
    });

    const result = await docClient.send(command);
    res.json(result.Items || []);
  } catch (error) {
    console.error('Error fetching shipments:', error);
    res.status(500).json({ error: 'Failed to fetch shipments' });
  }
});

// Get single shipment
router.get('/:id', async (req, res) => {
  try {
    const command = new GetCommand({
      TableName: SHIPMENTS_TABLE,
      Key: { id: req.params.id }
    });

    const result = await docClient.send(command);
    if (!result.Item) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    res.json(result.Item);
  } catch (error) {
    console.error('Error fetching shipment:', error);
    res.status(500).json({ error: 'Failed to fetch shipment' });
  }
});

// Create new shipment
router.post('/', async (req, res) => {
  try {
    const {
      orderId,
      courierId,
      courierName,
      customerName,
      customerAddress,
      customerPhone,
      estimatedDelivery,
      items
    } = req.body;

    if (!orderId || !courierId || !customerName) {
      return res.status(400).json({ error: 'Order ID, courier ID, and customer name are required' });
    }

    const shipmentId = uuidv4();
    const trackingNumber = `TRK${Date.now()}`;

    const shipment = {
      id: shipmentId,
      orderId,
      courierId,
      courierName: courierName || '',
      customerName,
      customerAddress: customerAddress || '',
      customerPhone: customerPhone || '',
      trackingNumber,
      status: 'Pending',
      estimatedDelivery: estimatedDelivery || null,
      items: items || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const command = new PutCommand({
      TableName: SHIPMENTS_TABLE,
      Item: shipment,
    });

    await docClient.send(command);
    res.status(201).json(shipment);
  } catch (error) {
    console.error('Error creating shipment:', error);
    res.status(500).json({ error: 'Failed to create shipment' });
  }
});

// Update shipment status
router.put('/:id/status', async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const command = new UpdateCommand({
      TableName: SHIPMENTS_TABLE,
      Key: { id: req.params.id },
      UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt' + (notes ? ', notes = :notes' : ''),
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': status,
        ':updatedAt': new Date().toISOString(),
        ...(notes && { ':notes': notes })
      },
      ReturnValues: 'ALL_NEW'
    });

    const result = await docClient.send(command);
    res.json(result.Attributes);
  } catch (error) {
    console.error('Error updating shipment status:', error);
    res.status(500).json({ error: 'Failed to update shipment status' });
  }
});

module.exports = router;