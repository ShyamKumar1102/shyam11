const express = require("express");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand
} = require("@aws-sdk/lib-dynamodb");

const router = express.Router();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const docClient = DynamoDBDocumentClient.from(client);

// Get all suppliers
router.get("/", async (req, res) => {
  try {
    const data = await docClient.send(
      new ScanCommand({
        TableName: process.env.SUPPLIERS_TABLE
      })
    );
    res.json({ success: true, data: data.Items || [] });
  } catch (err) {
    console.error('Error fetching suppliers:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch suppliers' });
  }
});

// Add supplier
router.post("/", async (req, res) => {
  try {
    const { supplierId, name, phone, email, address, company, status } = req.body;
    
    const supplier = {
      id: supplierId || `SUP${Date.now()}`,
      supplierId: supplierId || `SUP${Date.now()}`,
      name,
      phone,
      email,
      address: address || '',
      company: company || '',
      status: status || 'active',
      createdAt: new Date().toISOString()
    };

    await docClient.send(
      new PutCommand({
        TableName: process.env.SUPPLIERS_TABLE,
        Item: supplier
      })
    );

    res.status(201).json({ success: true, data: supplier });
  } catch (err) {
    console.error('Error adding supplier:', err);
    res.status(500).json({ success: false, error: 'Failed to add supplier' });
  }
});

module.exports = router;