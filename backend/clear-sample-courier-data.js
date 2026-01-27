const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
require('dotenv').config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

async function clearSampleData() {
  console.log('🗑️  Clearing sample courier data...\n');

  // Clear Couriers
  try {
    const couriersResult = await docClient.send(new ScanCommand({
      TableName: process.env.COURIERS_TABLE
    }));

    if (couriersResult.Items && couriersResult.Items.length > 0) {
      for (const item of couriersResult.Items) {
        await docClient.send(new DeleteCommand({
          TableName: process.env.COURIERS_TABLE,
          Key: { id: item.id }
        }));
        console.log(`✅ Deleted courier: ${item.name}`);
      }
    } else {
      console.log('ℹ️  No couriers to delete');
    }
  } catch (error) {
    console.log('❌ Error clearing couriers:', error.message);
  }

  // Clear Shipments
  try {
    const shipmentsResult = await docClient.send(new ScanCommand({
      TableName: process.env.SHIPMENTS_TABLE
    }));

    if (shipmentsResult.Items && shipmentsResult.Items.length > 0) {
      for (const item of shipmentsResult.Items) {
        await docClient.send(new DeleteCommand({
          TableName: process.env.SHIPMENTS_TABLE,
          Key: { id: item.id }
        }));
        console.log(`✅ Deleted shipment: ${item.trackingNumber}`);
      }
    } else {
      console.log('ℹ️  No shipments to delete');
    }
  } catch (error) {
    console.log('❌ Error clearing shipments:', error.message);
  }

  console.log('\n✨ Sample data cleared!');
  console.log('💡 Now dispatch items to create real shipments');
}

clearSampleData();
