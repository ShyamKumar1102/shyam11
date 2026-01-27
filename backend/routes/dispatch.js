const express = require('express');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, ScanCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
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

// Get all dispatch records
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: process.env.DISPATCH_TABLE
    }));
    res.json(result.Items || []);
  } catch (error) {
    console.error('Error fetching dispatch records:', error);
    res.status(500).json({ error: 'Failed to fetch dispatch records' });
  }
});

// Create dispatch record
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { stockId, itemName, dispatchedQuantity, invoiceId, customerId, customerName, notes, shipmentId } = req.body;
    
    const dispatch = {
      dispatchId: `DISP${Date.now()}`,
      stockId,
      itemName,
      dispatchedQuantity: parseInt(dispatchedQuantity),
      invoiceId,
      customerId,
      customerName,
      dispatchDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      shipmentId: shipmentId || null,
      notes: notes || '',
      createdAt: new Date().toISOString()
    };

    await docClient.send(new PutCommand({
      TableName: process.env.DISPATCH_TABLE,
      Item: dispatch
    }));

    res.status(201).json(dispatch);
  } catch (error) {
    console.error('Error creating dispatch record:', error);
    res.status(500).json({ error: 'Failed to create dispatch record' });
  }
});

// Update dispatch status
router.put('/:dispatchId/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    
    const result = await docClient.send(new UpdateCommand({
      TableName: process.env.DISPATCH_TABLE,
      Key: { dispatchId: req.params.dispatchId },
      UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: {
        ':status': status,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    }));

    res.json(result.Attributes);
  } catch (error) {
    console.error('Error updating dispatch status:', error);
    res.status(500).json({ error: 'Failed to update dispatch status' });
  }
});

module.exports = router;
