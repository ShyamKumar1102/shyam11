const express = require('express');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand, GetCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
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
const COURIERS_TABLE = process.env.COURIERS_TABLE || 'inventory-couriers';

// Get all couriers
router.get('/', async (req, res) => {
  try {
    const command = new ScanCommand({
      TableName: COURIERS_TABLE,
    });

    const result = await docClient.send(command);
    res.json(result.Items || []);
  } catch (error) {
    console.error('Error fetching couriers:', error);
    res.status(500).json({ error: 'Failed to fetch couriers' });
  }
});

// Create new courier
router.post('/', async (req, res) => {
  try {
    const { name, contactPerson, phone, email, address, pricing, rating, isActive } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    const courier = {
      id: uuidv4(),
      name,
      contactPerson: contactPerson || '',
      phone,
      email: email || '',
      address: address || '',
      pricing: pricing || 0,
      rating: rating || 0,
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const command = new PutCommand({
      TableName: COURIERS_TABLE,
      Item: courier,
    });

    await docClient.send(command);
    res.status(201).json(courier);
  } catch (error) {
    console.error('Error creating courier:', error);
    res.status(500).json({ error: 'Failed to create courier' });
  }
});

module.exports = router;