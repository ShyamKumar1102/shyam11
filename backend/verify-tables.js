const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
require('dotenv').config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = client;

const requiredTables = [
  process.env.USERS_TABLE,
  process.env.PRODUCTS_TABLE,
  process.env.STOCK_TABLE,
  process.env.ORDERS_TABLE,
  process.env.SUPPLIERS_TABLE,
  process.env.CUSTOMERS_TABLE,
  process.env.INVOICES_TABLE,
  process.env.PURCHASE_ORDERS_TABLE,
  process.env.PURCHASE_BILLS_TABLE,
  process.env.DISPATCH_TABLE,
  process.env.COURIERS_TABLE,
  process.env.SHIPMENTS_TABLE
];

async function checkTables() {
  try {
    const result = await client.send(new ListTablesCommand({}));
    const existingTables = result.TableNames || [];
    
    console.log('✅ DynamoDB Connection Successful');
    console.log('📋 Required Tables:', requiredTables.length);
    console.log('📊 Existing Tables:', existingTables.length);
    
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));
    
    if (missingTables.length > 0) {
      console.log('❌ Missing Tables:', missingTables);
      console.log('⚠️  Please create these tables before running the application');
      process.exit(1);
    } else {
      console.log('✅ All required tables exist');
      console.log('🚀 Ready to start application');
    }
  } catch (error) {
    console.error('❌ DynamoDB Connection Failed:', error.message);
    console.log('⚠️  Please check your AWS credentials and region');
    process.exit(1);
  }
}

checkTables();