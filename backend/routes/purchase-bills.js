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

// Get all purchase bills
router.get("/", async (req, res) => {
  try {
    const data = await docClient.send(
      new ScanCommand({
        TableName: process.env.PURCHASE_BILLS_TABLE || "purchase-bills"
      })
    );
    res.json(data.Items || []);
  } catch (err) {
    console.error('Error fetching purchase bills:', err);
    res.status(500).json({ error: "Failed to load purchase bills" });
  }
});

// Get single purchase bill
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: process.env.PURCHASE_BILLS_TABLE || "purchase-bills",
      Key: { billId: req.params.id }
    }));
    
    if (result.Item) {
      res.json(result.Item);
    } else {
      res.status(404).json({ error: 'Purchase bill not found' });
    }
  } catch (err) {
    console.error('Error fetching purchase bill:', err);
    res.status(500).json({ error: 'Failed to fetch purchase bill' });
  }
});

// Create purchase bill
router.post("/", async (req, res) => {
  try {
    const bill = {
      billId: `PB${Date.now()}`,
      supplierId: req.body.supplierId || '',
      supplierName: req.body.supplierName || '',
      supplierType: req.body.supplierType || 'registered',
      billDate: req.body.billDate || new Date().toISOString().split('T')[0],
      dueDate: req.body.dueDate || new Date().toISOString().split('T')[0],
      billNumber: req.body.billNumber || `PB-${Date.now()}`,
      items: req.body.items || [],
      subtotal: parseFloat(req.body.subtotal) || 0,
      tax: parseFloat(req.body.tax) || 0,
      totalAmount: parseFloat(req.body.totalAmount) || 0,
      status: req.body.status || 'Pending',
      notes: req.body.notes || '',
      createdAt: new Date().toISOString()
    };

    await docClient.send(
      new PutCommand({
        TableName: process.env.PURCHASE_BILLS_TABLE || "purchase-bills",
        Item: bill
      })
    );

    res.status(201).json(bill);
  } catch (err) {
    console.error('Error creating purchase bill:', err);
    res.status(500).json({ error: "Failed to create purchase bill", details: err.message });
  }
});

// Update purchase bill
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const result = await docClient.send(new UpdateCommand({
      TableName: process.env.PURCHASE_BILLS_TABLE || "purchase-bills",
      Key: { billId: req.params.id },
      UpdateExpression: 'SET supplierName = :supplierName, supplierType = :supplierType, billDate = :billDate, dueDate = :dueDate, billNumber = :billNumber, items = :items, subtotal = :subtotal, tax = :tax, totalAmount = :totalAmount, #status = :status, notes = :notes, updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: {
        ':supplierName': req.body.supplierName,
        ':supplierType': req.body.supplierType,
        ':billDate': req.body.billDate,
        ':dueDate': req.body.dueDate,
        ':billNumber': req.body.billNumber,
        ':items': req.body.items,
        ':subtotal': req.body.subtotal,
        ':tax': req.body.tax,
        ':totalAmount': req.body.totalAmount,
        ':status': req.body.status,
        ':notes': req.body.notes,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    }));

    res.json(result.Attributes);
  } catch (err) {
    console.error('Error updating purchase bill:', err);
    res.status(500).json({ error: 'Failed to update purchase bill' });
  }
});

// Delete purchase bill
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    await docClient.send(new DeleteCommand({
      TableName: process.env.PURCHASE_BILLS_TABLE || "purchase-bills",
      Key: { billId: req.params.id }
    }));

    res.json({ message: 'Purchase bill deleted successfully' });
  } catch (err) {
    console.error('Error deleting purchase bill:', err);
    res.status(500).json({ error: 'Failed to delete purchase bill' });
  }
});

module.exports = router;