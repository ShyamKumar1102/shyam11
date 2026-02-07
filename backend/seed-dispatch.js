const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
require('dotenv').config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

const sampleDispatches = [
  {
    dispatchId: 'DISP1704067200000',
    stockId: 'STK001',
    itemName: 'Sample Product A',
    dispatchedQuantity: 50,
    invoiceId: 'INV001',
    customerId: 'CUST001',
    customerName: 'John Doe',
    dispatchDate: '2024-01-01',
    status: 'Delivered',
    notes: 'Delivered successfully',
    createdAt: new Date().toISOString()
  },
  {
    dispatchId: 'DISP1704153600000',
    stockId: 'STK002',
    itemName: 'Sample Product B',
    dispatchedQuantity: 30,
    invoiceId: 'INV002',
    customerId: 'CUST002',
    customerName: 'Jane Smith',
    dispatchDate: '2024-01-02',
    status: 'In Transit',
    notes: 'On the way',
    createdAt: new Date().toISOString()
  }
];

async function seedDispatch() {
  try {
    for (const dispatch of sampleDispatches) {
      await docClient.send(new PutCommand({
        TableName: process.env.DISPATCH_TABLE,
        Item: dispatch
      }));
      console.log(`Added dispatch: ${dispatch.dispatchId}`);
    }
    console.log('Dispatch data seeded successfully!');
  } catch (error) {
    console.error('Error seeding dispatch data:', error);
  }
}

seedDispatch();
