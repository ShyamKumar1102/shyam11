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

// Get all customers
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: process.env.CUSTOMERS_TABLE
    }));
    res.json(result.Items || []);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get single customer
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: process.env.CUSTOMERS_TABLE,
      Key: { customerId: req.params.id }
    }));
    
    if (result.Item) {
      res.json(result.Item);
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// Create customer
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, address, company } = req.body;
    
    const customer = {
      customerId: `CUS${Date.now()}`,
      name,
      email,
      phone,
      address: address || '',
      company: company || '',
      createdAt: new Date().toISOString()
    };

    await docClient.send(new PutCommand({
      TableName: process.env.CUSTOMERS_TABLE,
      Item: customer
    }));

    res.status(201).json(customer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// Update customer
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, address, company } = req.body;
    
    const result = await docClient.send(new UpdateCommand({
      TableName: process.env.CUSTOMERS_TABLE,
      Key: { customerId: req.params.id },
      UpdateExpression: 'SET #name = :name, email = :email, phone = :phone, address = :address, company = :company, updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#name': 'name' },
      ExpressionAttributeValues: {
        ':name': name,
        ':email': email,
        ':phone': phone,
        ':address': address || '',
        ':company': company || '',
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    }));

    res.json(result.Attributes);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// Delete customer
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await docClient.send(new DeleteCommand({
      TableName: process.env.CUSTOMERS_TABLE,
      Key: { customerId: req.params.id }
    }));

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

module.exports = router;
