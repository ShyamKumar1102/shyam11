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

async function clearTable(tableName, keyName) {
  try {
    console.log(`\nClearing ${tableName}...`);
    
    const scanResult = await docClient.send(new ScanCommand({
      TableName: tableName
    }));

    if (!scanResult.Items || scanResult.Items.length === 0) {
      console.log(`✓ ${tableName} is already empty`);
      return;
    }

    console.log(`Found ${scanResult.Items.length} items to delete`);

    for (const item of scanResult.Items) {
      await docClient.send(new DeleteCommand({
        TableName: tableName,
        Key: { [keyName]: item[keyName] }
      }));
    }

    console.log(`✓ Cleared ${scanResult.Items.length} items from ${tableName}`);
  } catch (error) {
    console.error(`✗ Error clearing ${tableName}:`, error.message);
  }
}

async function clearAllData() {
  console.log('🗑️  Clearing all demo/sample data from database...\n');
  console.log('⚠️  WARNING: This will delete ALL data from the following tables:');
  console.log('   - Orders');
  console.log('   - Purchase Orders');
  console.log('   - Products (optional)');
  console.log('   - Stock (optional)');
  console.log('\nPress Ctrl+C within 5 seconds to cancel...\n');

  await new Promise(resolve => setTimeout(resolve, 5000));

  await clearTable(process.env.ORDERS_TABLE, 'id');
  await clearTable(process.env.PURCHASE_ORDERS_TABLE, 'purchaseorderId');
  
  console.log('\n✅ Demo data cleared successfully!');
  console.log('\nNote: User accounts were preserved.');
}

clearAllData();
