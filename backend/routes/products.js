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

// Get all products
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: process.env.PRODUCTS_TABLE
    }));
    res.json(result.Items || []);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: process.env.PRODUCTS_TABLE,
      Key: { id: req.params.id }
    }));
    
    if (result.Item) {
      res.json(result.Item);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, productId, category, barcode, quantity, price } = req.body;
    
    // Generate barcode if not provided
    const generatedBarcode = barcode || Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
    
    const product = {
      id: productId || Date.now().toString(),
      name,
      category,
      barcode: generatedBarcode,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      createdAt: new Date().toISOString()
    };

    await docClient.send(new PutCommand({
      TableName: process.env.PRODUCTS_TABLE,
      Item: product
    }));

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, category, barcode, quantity, price } = req.body;
    
    const result = await docClient.send(new UpdateCommand({
      TableName: process.env.PRODUCTS_TABLE,
      Key: { id: req.params.id },
      UpdateExpression: 'SET #name = :name, category = :category, barcode = :barcode, quantity = :quantity, price = :price, updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#name': 'name' },
      ExpressionAttributeValues: {
        ':name': name,
        ':category': category,
        ':barcode': barcode,
        ':quantity': parseInt(quantity),
        ':price': parseFloat(price),
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    }));

    res.json(result.Attributes);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await docClient.send(new DeleteCommand({
      TableName: process.env.PRODUCTS_TABLE,
      Key: { id: req.params.id }
    }));

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;