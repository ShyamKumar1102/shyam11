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

// Get all customers
router.get('/', async (req, res) => {
  try {
    if (docClient) {
      const result = await docClient.send(new ScanCommand({
        TableName: process.env.CUSTOMERS_TABLE || 'inventory-customers'
      }));
      res.json({ success: true, data: result.Items || [] });
    } else {
      const customers = db.getAll('customers');
      res.json({ success: true, data: customers });
    }
  } catch (error) {
    console.error('Error fetching customers:', error);
    const customers = db.getAll('customers');
    res.json({ success: true, data: customers });
  }
});

// Create customer
router.post('/', async (req, res) => {
  try {
    const { customerId, name, email, phone, address, company } = req.body;
    
    const customer = {
      id: customerId || `CUS${Date.now()}`,
      customerId: customerId || `CUS${Date.now()}`,
      name,
      email,
      phone,
      address: address || '',
      company: company || '',
      createdAt: new Date().toISOString()
    };

    if (docClient) {
      await docClient.send(new PutCommand({
        TableName: process.env.CUSTOMERS_TABLE || 'inventory-customers',
        Item: customer
      }));
    } else {
      db.create('customers', customer);
    }

    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    console.error('Error creating customer:', error);
    const newCustomer = db.create('customers', {
      id: req.body.customerId || `CUS${Date.now()}`,
      customerId: req.body.customerId || `CUS${Date.now()}`,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address || '',
      company: req.body.company || ''
    });
    res.status(201).json({ success: true, data: newCustomer });
  }
});

module.exports = router;
