const express = require('express');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, ScanCommand, GetCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
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

// Get all purchase orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: process.env.PURCHASE_ORDERS_TABLE
    }));
    res.json(result.Items || []);
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    res.status(500).json({ error: 'Failed to fetch purchase orders' });
  }
});

// Get single purchase order
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: process.env.PURCHASE_ORDERS_TABLE,
      Key: { purchaseorderId: req.params.id }
    }));
    
    if (result.Item) {
      res.json(result.Item);
    } else {
      res.status(404).json({ error: 'Purchase order not found' });
    }
  } catch (error) {
    console.error('Error fetching purchase order:', error);
    res.status(500).json({ error: 'Failed to fetch purchase order' });
  }
});

// Create purchase order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { poId, supplierName, supplierId, items, totalAmount, date, deliveryDate, status } = req.body;
    
    // Generate PO ID if not provided
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const generatedPOId = poId || `PO-${timestamp}-${random}`;
    
    const purchaseOrder = {
      purchaseorderId: generatedPOId,
      supplierName,
      supplierId,
      items: items || [],
      amount: parseFloat(totalAmount),
      date: date || new Date().toISOString().split('T')[0],
      deliveryDate: deliveryDate || null,
      status: status || 'Pending',
      createdAt: new Date().toISOString()
    };

    await docClient.send(new PutCommand({
      TableName: process.env.PURCHASE_ORDERS_TABLE,
      Item: purchaseOrder
    }));

    res.status(201).json(purchaseOrder);
  } catch (error) {
    console.error('Error creating purchase order:', error);
    res.status(500).json({ error: 'Failed to create purchase order' });
  }
});

// Update purchase order
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { status, amount } = req.body;
    
    const result = await docClient.send(new UpdateCommand({
      TableName: process.env.PURCHASE_ORDERS_TABLE,
      Key: { purchaseorderId: req.params.id },
      UpdateExpression: 'SET #status = :status, amount = :amount, updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: {
        ':status': status,
        ':amount': parseFloat(amount),
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    }));

    res.json(result.Attributes);
  } catch (error) {
    console.error('Error updating purchase order:', error);
    res.status(500).json({ error: 'Failed to update purchase order' });
  }
});

// Delete purchase order
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await docClient.send(new DeleteCommand({
      TableName: process.env.PURCHASE_ORDERS_TABLE,
      Key: { purchaseorderId: req.params.id }
    }));

    res.json({ message: 'Purchase order deleted successfully' });
  } catch (error) {
    console.error('Error deleting purchase order:', error);
    res.status(500).json({ error: 'Failed to delete purchase order' });
  }
});

module.exports = router;
