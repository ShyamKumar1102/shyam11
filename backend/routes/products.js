const express = require('express');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, ScanCommand, GetCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const router = express.Router();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const docClient = DynamoDBDocumentClient.from(client);

// Get all products
router.get('/', async (req, res) => {
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: process.env.PRODUCTS_TABLE
    }));
    res.json({ success: true, data: result.Items || [] });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// Create product
router.post('/', async (req, res) => {
  try {
    const { name, productId, category, barcode, quantity, price } = req.body;
    
    const product = {
      id: productId || Date.now().toString(),
      name,
      category,
      barcode: barcode || Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0'),
      quantity: parseInt(quantity) || 0,
      price: parseFloat(price) || 0,
      createdAt: new Date().toISOString()
    };

    await docClient.send(new PutCommand({
      TableName: process.env.PRODUCTS_TABLE,
      Item: product
    }));

    res.status(201).json({ success: true, data: product });
    
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, error: 'Failed to create product' });
  }
});

module.exports = router;