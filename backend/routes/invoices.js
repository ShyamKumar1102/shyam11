const express = require('express');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
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
const INVOICES_TABLE = process.env.INVOICES_TABLE || 'inventory-invoices';

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const command = new ScanCommand({
      TableName: INVOICES_TABLE,
    });

    const result = await docClient.send(command);
    res.json(result.Items || []);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Create new invoice
router.post('/', async (req, res) => {
  try {
    const {
      customerId,
      customerName,
      invoiceDate,
      dueDate,
      items,
      notes,
      subtotal,
      tax,
      totalAmount,
      status
    } = req.body;

    if (!customerId || !items || items.length === 0) {
      return res.status(400).json({ error: 'Customer ID and items are required' });
    }

    const invoiceId = uuidv4();
    const invoiceNumber = `INV-${Date.now()}`;

    const invoice = {
      invoiceId,
      invoiceNumber,
      customerId,
      customerName,
      invoiceDate,
      dueDate,
      items,
      notes: notes || '',
      subtotal: subtotal || 0,
      tax: tax || 0,
      totalAmount: totalAmount || 0,
      status: status || 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const command = new PutCommand({
      TableName: INVOICES_TABLE,
      Item: invoice,
    });

    await docClient.send(command);
    res.status(201).json(invoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

module.exports = router;