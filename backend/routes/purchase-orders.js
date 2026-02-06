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

// Get all purchase orders
router.get("/", async (req, res) => {
  try {
    const data = await docClient.send(
      new ScanCommand({
        TableName: process.env.PURCHASE_ORDERS_TABLE
      })
    );
    res.json(data.Items || []);
  } catch (err) {
    console.error('Error fetching purchase orders:', err);
    res.status(500).json({ error: "Failed to load purchase orders" });
  }
});

// Get single purchase order
router.get("/:id", async (req, res) => {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: process.env.PURCHASE_ORDERS_TABLE,
      Key: { purchaseorderId: req.params.id }
    }));
    
    if (result.Item) {
      res.json(result.Item);
    } else {
      res.status(404).json({ error: 'Purchase order not found' });
    }
  } catch (err) {
    console.error('Error fetching purchase order:', err);
    res.status(500).json({ error: 'Failed to fetch purchase order' });
  }
});

// Create purchase order
router.post("/", async (req, res) => {
  try {
    const generateOrderId = () => {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `PO${timestamp}${random}`;
    };

    const order = {
      purchaseorderId: req.body.orderId || generateOrderId(),
      orderId: req.body.orderId || generateOrderId(),
      supplierId: req.body.supplierId || '',
      supplierName: req.body.supplierName || '',
      supplierEmail: req.body.supplierEmail || '',
      supplierPhone: req.body.supplierPhone || '',
      supplierAddress: req.body.supplierAddress || '',
      orderDate: req.body.orderDate || new Date().toISOString().split('T')[0],
      expectedDelivery: req.body.expectedDelivery || '',
      productName: req.body.productName || '',
      quantity: parseInt(req.body.quantity) || 0,
      unitPrice: parseFloat(req.body.unitPrice) || 0,
      totalAmount: parseFloat(req.body.totalAmount) || (parseInt(req.body.quantity) || 0) * (parseFloat(req.body.unitPrice) || 0),
      status: req.body.status || 'Pending',
      notes: req.body.notes || '',
      createdAt: new Date().toISOString()
    };

    await docClient.send(new PutCommand({
      TableName: process.env.PURCHASE_ORDERS_TABLE,
      Item: order
    }));
    
    res.status(201).json({ success: true, data: order });
    
  } catch (err) {
    console.error('Error creating purchase order:', err);
    res.status(500).json({ success: false, error: "Failed to create purchase order" });
  }
});

// Update purchase order
router.put("/:id", async (req, res) => {
  try {
    const result = await docClient.send(new UpdateCommand({
      TableName: process.env.PURCHASE_ORDERS_TABLE,
      Key: { purchaseorderId: req.params.id },
      UpdateExpression: 'SET supplierName = :supplierName, orderDate = :orderDate, expectedDelivery = :expectedDelivery, productName = :productName, quantity = :quantity, unitPrice = :unitPrice, totalAmount = :totalAmount, #status = :status, notes = :notes, updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: {
        ':supplierName': req.body.supplierName,
        ':orderDate': req.body.orderDate,
        ':expectedDelivery': req.body.expectedDelivery,
        ':productName': req.body.productName,
        ':quantity': parseInt(req.body.quantity),
        ':unitPrice': parseFloat(req.body.unitPrice),
        ':totalAmount': parseFloat(req.body.totalAmount),
        ':status': req.body.status,
        ':notes': req.body.notes,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    }));

    res.json(result.Attributes);
  } catch (err) {
    console.error('Error updating purchase order:', err);
    res.status(500).json({ error: 'Failed to update purchase order' });
  }
});

// Delete purchase order
router.delete("/:id", async (req, res) => {
  try {
    await docClient.send(new DeleteCommand({
      TableName: process.env.PURCHASE_ORDERS_TABLE,
      Key: { purchaseorderId: req.params.id }
    }));

    res.json({ message: 'Purchase order deleted successfully' });
  } catch (err) {
    console.error('Error deleting purchase order:', err);
    res.status(500).json({ error: 'Failed to delete purchase order' });
  }
});

module.exports = router;