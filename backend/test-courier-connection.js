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

async function testConnection() {
  console.log('🔍 Testing DynamoDB Connection for Courier Services...\n');
  console.log('📍 Region:', process.env.AWS_REGION);
  console.log('🔑 Access Key:', process.env.AWS_ACCESS_KEY_ID?.substring(0, 10) + '...\n');

  // Test Couriers Table
  try {
    console.log('📦 Testing COURIERS table:', process.env.COURIERS_TABLE);
    const couriersResult = await docClient.send(new ScanCommand({
      TableName: process.env.COURIERS_TABLE,
      Limit: 1
    }));
    console.log('✅ Couriers table connected successfully!');
    console.log('   Items in table:', couriersResult.Count || 0);
  } catch (error) {
    console.log('❌ Couriers table error:', error.message);
  }

  // Test Shipments Table
  try {
    console.log('\n📦 Testing SHIPMENTS table:', process.env.SHIPMENTS_TABLE);
    const shipmentsResult = await docClient.send(new ScanCommand({
      TableName: process.env.SHIPMENTS_TABLE,
      Limit: 1
    }));
    console.log('✅ Shipments table connected successfully!');
    console.log('   Items in table:', shipmentsResult.Count || 0);
  } catch (error) {
    console.log('❌ Shipments table error:', error.message);
  }

  console.log('\n✨ Connection test complete!');
}

testConnection();
