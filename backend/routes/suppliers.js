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
const { authenticateToken } = require("../middleware/auth");

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
router.get("/", authenticateToken, async (req, res) => {
  try {
    const data = await docClient.send(
      new ScanCommand({
        TableName: process.env.SUPPLIERS_TABLE
      })
    );
    res.json(data.Items || []);
  } catch (err) {
    console.error('Error fetching suppliers:', err);
    res.status(500).json({ error: "Failed to load suppliers" });
  }
});

// Get single supplier
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: process.env.SUPPLIERS_TABLE,
      Key: { supplierId: req.params.id }
    }));
    
    if (result.Item) {
      res.json(result.Item);
    } else {
      res.status(404).json({ error: 'Supplier not found' });
    }
  } catch (err) {
    console.error('Error fetching supplier:', err);
    res.status(500).json({ error: 'Failed to fetch supplier' });
  }
});

// Add supplier
router.post("/", authenticateToken, async (req, res) => {
  try {
    const supplier = {
      supplierId: `SUP${Date.now()}`,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address || '',
      company: req.body.company || '',
      createdAt: new Date().toISOString()
    };

    await docClient.send(
      new PutCommand({
        TableName: process.env.SUPPLIERS_TABLE,
        Item: supplier
      })
    );

    res.status(201).json(supplier);
  } catch (err) {
    console.error('Error adding supplier:', err);
    res.status(500).json({ error: "Failed to add supplier" });
  }
});

// Update supplier
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, address, company } = req.body;
    
    const result = await docClient.send(new UpdateCommand({
      TableName: process.env.SUPPLIERS_TABLE,
      Key: { supplierId: req.params.id },
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
  } catch (err) {
    console.error('Error updating supplier:', err);
    res.status(500).json({ error: 'Failed to update supplier' });
  }
});

// Delete supplier
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    await docClient.send(new DeleteCommand({
      TableName: process.env.SUPPLIERS_TABLE,
      Key: { supplierId: req.params.id }
    }));

    res.json({ message: 'Supplier deleted successfully' });
  } catch (err) {
    console.error('Error deleting supplier:', err);
    res.status(500).json({ error: 'Failed to delete supplier' });
  }
});

module.exports = router;