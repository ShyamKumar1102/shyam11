const express = require('express');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
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

// Get all orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: process.env.ORDERS_TABLE
    }));
    res.json(result.Items || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get orders by date range
router.get('/range', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const result = await docClient.send(new ScanCommand({
      TableName: process.env.ORDERS_TABLE,
      FilterExpression: 'orderDate BETWEEN :startDate AND :endDate',
      ExpressionAttributeValues: {
        ':startDate': startDate,
        ':endDate': endDate
      }
    }));
    res.json(result.Items || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders by date range' });
  }
});

// Create order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { customerId, customerName, items, orderValue } = req.body;
    
    const order = {
      id: Date.now().toString(),
      customerId,
      customerName,
      items,
      orderValue: parseFloat(orderValue),
      orderDate: new Date().toISOString().split('T')[0],
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    await docClient.send(new PutCommand({
      TableName: process.env.ORDERS_TABLE,
      Item: order
    }));

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get income summary
router.get('/income/summary', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let filterExpression = undefined;
    let expressionAttributeValues = undefined;
    
    if (startDate && endDate) {
      filterExpression = 'orderDate BETWEEN :startDate AND :endDate';
      expressionAttributeValues = {
        ':startDate': startDate,
        ':endDate': endDate
      };
    }
    
    const result = await docClient.send(new ScanCommand({
      TableName: process.env.ORDERS_TABLE,
      FilterExpression: filterExpression,
      ExpressionAttributeValues: expressionAttributeValues
    }));
    
    const orders = result.Items || [];
    const totalIncome = orders.reduce((sum, order) => sum + (order.orderValue || 0), 0);
    const totalOrders = orders.length;
    
    res.json({
      totalIncome,
      totalOrders,
      orders
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch income summary' });
  }
});

module.exports = router;