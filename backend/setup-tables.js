const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { CreateTableCommand, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
require('dotenv').config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const tables = [
  {
    name: process.env.USERS_TABLE || 'inventory-users',
    schema: {
      TableName: process.env.USERS_TABLE || 'inventory-users',
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'email', AttributeType: 'S' }
      ],
      GlobalSecondaryIndexes: [{
        IndexName: 'EmailIndex',
        KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
      }],
      ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
    }
  },
  {
    name: process.env.PRODUCTS_TABLE || 'inventory-products',
    schema: {
      TableName: process.env.PRODUCTS_TABLE || 'inventory-products',
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
      ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
    }
  },
  {
    name: process.env.STOCK_TABLE || 'inventory-stock',
    schema: {
      TableName: process.env.STOCK_TABLE || 'inventory-stock',
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
      ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
    }
  },
  {
    name: process.env.ORDERS_TABLE || 'inventory-orders',
    schema: {
      TableName: process.env.ORDERS_TABLE || 'inventory-orders',
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
      ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
    }
  },
  {
    name: process.env.CUSTOMERS_TABLE || 'inventory-customers',
    schema: {
      TableName: process.env.CUSTOMERS_TABLE || 'inventory-customers',
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
      ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
    }
  },
  {
    name: process.env.SUPPLIERS_TABLE || 'inventory-suppliers',
    schema: {
      TableName: process.env.SUPPLIERS_TABLE || 'inventory-suppliers',
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
      ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
    }
  },
  {
    name: process.env.INVOICES_TABLE || 'inventory-invoices',
    schema: {
      TableName: process.env.INVOICES_TABLE || 'inventory-invoices',
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
      ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
    }
  },
  {
    name: process.env.PURCHASE_ORDERS_TABLE || 'inventory-purchase-orders',
    schema: {
      TableName: process.env.PURCHASE_ORDERS_TABLE || 'inventory-purchase-orders',
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
      ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
    }
  }
];

async function checkAndCreateTables() {
  try {
    console.log('🔍 Checking existing tables...\n');
    
    // List existing tables
    const listCommand = new ListTablesCommand({});
    const { TableNames } = await client.send(listCommand);
    
    console.log('📋 Existing tables:', TableNames || []);
    console.log('\n');

    // Create missing tables
    for (const table of tables) {
      if (TableNames && TableNames.includes(table.name)) {
        console.log(`✅ Table "${table.name}" already exists`);
      } else {
        console.log(`📝 Creating table "${table.name}"...`);
        try {
          await client.send(new CreateTableCommand(table.schema));
          console.log(`✅ Table "${table.name}" created successfully`);
        } catch (error) {
          if (error.name === 'ResourceInUseException') {
            console.log(`✅ Table "${table.name}" already exists`);
          } else {
            console.error(`❌ Error creating table "${table.name}":`, error.message);
          }
        }
      }
    }

    console.log('\n✅ All tables checked/created successfully!');
    console.log('\n📊 Required tables:');
    tables.forEach(table => {
      console.log(`   - ${table.name}`);
    });
    console.log('\n✅ Total tables: ' + tables.length);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAndCreateTables();
