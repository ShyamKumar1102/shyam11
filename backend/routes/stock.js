const express = require('express');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, ScanCommand, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const router = express.Router();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const docClient = DynamoDBDocumentClient.from(client);

router.get('/', async (req, res) => {
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: process.env.STOCK_TABLE
    }));
    res.json({ success: true, data: result.Items || [] });
  } catch (error) {
    console.error('Error fetching stock:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch stock' });
  }
});

// Update stock
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    
    const result = await docClient.send(new UpdateCommand({
      TableName: process.env.STOCK_TABLE,
      Key: { id: req.params.id },
      UpdateExpression: 'SET quantity = :quantity, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':quantity': parseInt(updates.quantity) || 0,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    }));
    res.json({ success: true, data: result.Attributes });
    
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ success: false, error: 'Failed to update stock' });
  }
});

// Create stock
router.post('/', async (req, res) => {
  try {
    const { stockId, productId, itemName, category, quantity, location, supplier, batchNumber } = req.body;
    
    const stock = {
      id: stockId || Date.now().toString(),
      productId,
      itemName,
      category,
      quantity: parseInt(quantity) || 0,
      location,
      supplier,
      batchNumber,
      createdAt: new Date().toISOString()
    };

    await docClient.send(new PutCommand({
      TableName: process.env.STOCK_TABLE,
      Item: stock
    }));

    res.status(201).json({ success: true, data: stock });
    
  } catch (error) {
    console.error('Error creating stock:', error);
    res.status(500).json({ success: false, error: 'Failed to create stock' });
  }
});

module.exports = router;