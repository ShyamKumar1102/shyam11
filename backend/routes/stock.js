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

router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: process.env.STOCK_TABLE
    }));
    res.json(result.Items || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock' });
  }
});

// Get single stock item
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: process.env.STOCK_TABLE,
      Key: { id: req.params.id }
    }));
    
    if (result.Item) {
      res.json(result.Item);
    } else {
      res.status(404).json({ error: 'Stock item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock item' });
  }
});

// Create stock
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { productId, itemName, category, quantity, location, supplier, batchNumber } = req.body;
    
    const stock = {
      id: Date.now().toString(),
      productId,
      itemName,
      category,
      quantity: parseInt(quantity),
      location,
      supplier,
      batchNumber,
      createdAt: new Date().toISOString()
    };

    await docClient.send(new PutCommand({
      TableName: process.env.STOCK_TABLE,
      Item: stock
    }));

    res.status(201).json(stock);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create stock' });
  }
});

// Update stock
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    console.log('Update stock request - ID:', req.params.id, 'Body:', req.body);
    const updates = req.body;
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = { ':updatedAt': new Date().toISOString() };
    
    if (updates.quantity !== undefined) {
      updateExpressions.push('quantity = :quantity');
      expressionAttributeValues[':quantity'] = parseInt(updates.quantity);
    }
    if (updates.category !== undefined) {
      updateExpressions.push('category = :category');
      expressionAttributeValues[':category'] = updates.category;
    }
    if (updates.location !== undefined) {
      updateExpressions.push('#location = :location');
      expressionAttributeNames['#location'] = 'location';
      expressionAttributeValues[':location'] = updates.location;
    }
    if (updates.supplier !== undefined) {
      updateExpressions.push('supplier = :supplier');
      expressionAttributeValues[':supplier'] = updates.supplier;
    }
    if (updates.batchNumber !== undefined) {
      updateExpressions.push('batchNumber = :batchNumber');
      expressionAttributeValues[':batchNumber'] = updates.batchNumber;
    }
    
    updateExpressions.push('updatedAt = :updatedAt');
    
    const params = {
      TableName: process.env.STOCK_TABLE,
      Key: { id: req.params.id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };
    
    if (Object.keys(expressionAttributeNames).length > 0) {
      params.ExpressionAttributeNames = expressionAttributeNames;
    }
    
    console.log('DynamoDB update params:', JSON.stringify(params, null, 2));
    const result = await docClient.send(new UpdateCommand(params));
    console.log('Update result:', result.Attributes);
    res.json(result.Attributes);
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ error: 'Failed to update stock' });
  }
});

// Dispatch stock
router.post('/:id/dispatch', authenticateToken, async (req, res) => {
  try {
    const { dispatchQuantity } = req.body;
    
    const getResult = await docClient.send(new GetCommand({
      TableName: process.env.STOCK_TABLE,
      Key: { id: req.params.id }
    }));
    
    if (!getResult.Item) {
      return res.status(404).json({ error: 'Stock item not found' });
    }
    
    const currentQuantity = getResult.Item.quantity;
    const newQuantity = currentQuantity - parseInt(dispatchQuantity);
    
    if (newQuantity < 0) {
      return res.status(400).json({ error: 'Insufficient stock quantity' });
    }
    
    const result = await docClient.send(new UpdateCommand({
      TableName: process.env.STOCK_TABLE,
      Key: { id: req.params.id },
      UpdateExpression: 'SET quantity = :quantity, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':quantity': newQuantity,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    }));

    res.json(result.Attributes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to dispatch stock' });
  }
});

module.exports = router;