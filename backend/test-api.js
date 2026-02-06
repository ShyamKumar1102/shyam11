const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');
require('dotenv').config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const docClient = DynamoDBDocumentClient.from(client);

async function testPurchaseOrders() {
  try {
    console.log('Testing purchase orders API...');
    console.log('Table:', process.env.PURCHASE_ORDERS_TABLE);
    
    const data = await docClient.send(
      new ScanCommand({
        TableName: process.env.PURCHASE_ORDERS_TABLE
      })
    );
    
    console.log('✅ Success! Items found:', data.Items?.length || 0);
    console.log('Items:', data.Items);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testPurchaseOrders();