const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');
require('dotenv').config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function createCouriersTable() {
  const params = {
    TableName: process.env.COURIERS_TABLE,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  };

  try {
    await client.send(new CreateTableCommand(params));
    console.log('✅ Couriers table created successfully');
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('ℹ️  Couriers table already exists');
    } else {
      console.error('❌ Error creating couriers table:', error);
    }
  }
}

async function createShipmentsTable() {
  const params = {
    TableName: process.env.SHIPMENTS_TABLE,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  };

  try {
    await client.send(new CreateTableCommand(params));
    console.log('✅ Shipments table created successfully');
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('ℹ️  Shipments table already exists');
    } else {
      console.error('❌ Error creating shipments table:', error);
    }
  }
}

async function setupTables() {
  console.log('🚀 Setting up courier service tables...\n');
  await createCouriersTable();
  await createShipmentsTable();
  console.log('\n✨ Setup complete!');
}

setupTables();
