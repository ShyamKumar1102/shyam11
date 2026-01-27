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

// Get all couriers
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: process.env.COURIERS_TABLE
    }));
    res.json(result.Items || []);
  } catch (error) {
    console.error('Error fetching couriers:', error);
    res.status(500).json({ error: 'Failed to fetch couriers' });
  }
});

// Get single courier
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: process.env.COURIERS_TABLE,
      Key: { id: req.params.id }
    }));
    
    if (result.Item) {
      res.json(result.Item);
    } else {
      res.status(404).json({ error: 'Courier not found' });
    }
  } catch (error) {
    console.error('Error fetching courier:', error);
    res.status(500).json({ error: 'Failed to fetch courier' });
  }
});

// Create courier
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, contact, email, serviceAreas, pricing, rating } = req.body;
    
    const courier = {
      id: Date.now().toString(),
      name,
      contact,
      email,
      serviceAreas: serviceAreas || [],
      pricing: parseFloat(pricing) || 0,
      rating: parseFloat(rating) || 0,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    await docClient.send(new PutCommand({
      TableName: process.env.COURIERS_TABLE,
      Item: courier
    }));

    res.status(201).json(courier);
  } catch (error) {
    console.error('Error creating courier:', error);
    res.status(500).json({ error: 'Failed to create courier' });
  }
});

// Update courier
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, contact, email, serviceAreas, pricing, rating, isActive } = req.body;
    
    const result = await docClient.send(new UpdateCommand({
      TableName: process.env.COURIERS_TABLE,
      Key: { id: req.params.id },
      UpdateExpression: 'SET #name = :name, contact = :contact, email = :email, serviceAreas = :serviceAreas, pricing = :pricing, rating = :rating, isActive = :isActive, updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#name': 'name' },
      ExpressionAttributeValues: {
        ':name': name,
        ':contact': contact,
        ':email': email,
        ':serviceAreas': serviceAreas || [],
        ':pricing': parseFloat(pricing),
        ':rating': parseFloat(rating),
        ':isActive': isActive !== undefined ? isActive : true,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    }));

    res.json(result.Attributes);
  } catch (error) {
    console.error('Error updating courier:', error);
    res.status(500).json({ error: 'Failed to update courier' });
  }
});

// Delete courier
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await docClient.send(new DeleteCommand({
      TableName: process.env.COURIERS_TABLE,
      Key: { id: req.params.id }
    }));

    res.json({ message: 'Courier deleted successfully' });
  } catch (error) {
    console.error('Error deleting courier:', error);
    res.status(500).json({ error: 'Failed to delete courier' });
  }
});

module.exports = router;
