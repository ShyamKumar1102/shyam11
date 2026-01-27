const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
require('dotenv').config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

async function addSampleData() {
  console.log('🚀 Adding sample courier data...\n');

  // Sample Couriers
  const sampleCouriers = [
    {
      id: Date.now().toString(),
      name: 'FedEx Express',
      contact: '+1-800-463-3339',
      email: 'support@fedex.com',
      serviceAreas: ['New York', 'Los Angeles', 'Chicago', 'Houston'],
      pricing: 15.99,
      rating: 4.5,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: (Date.now() + 1).toString(),
      name: 'DHL International',
      contact: '+1-800-225-5345',
      email: 'contact@dhl.com',
      serviceAreas: ['Miami', 'Boston', 'Seattle', 'Dallas'],
      pricing: 18.50,
      rating: 4.7,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: (Date.now() + 2).toString(),
      name: 'UPS Ground',
      contact: '+1-800-742-5877',
      email: 'service@ups.com',
      serviceAreas: ['Atlanta', 'Phoenix', 'Denver', 'Portland'],
      pricing: 12.99,
      rating: 4.3,
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ];

  // Add couriers
  for (const courier of sampleCouriers) {
    try {
      await docClient.send(new PutCommand({
        TableName: process.env.COURIERS_TABLE,
        Item: courier
      }));
      console.log(`✅ Added courier: ${courier.name}`);
    } catch (error) {
      console.log(`❌ Error adding ${courier.name}:`, error.message);
    }
  }

  // Sample Shipment
  const sampleShipment = {
    id: Date.now().toString(),
    orderId: 'ORD' + Date.now(),
    courierId: sampleCouriers[0].id,
    courierName: sampleCouriers[0].name,
    trackingNumber: `TRK${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    customerName: 'John Doe',
    customerAddress: '123 Main Street, New York, NY 10001',
    customerPhone: '+1-555-123-4567',
    items: [],
    status: 'Pending',
    shipmentDate: new Date().toISOString().split('T')[0],
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    pickupDate: null,
    deliveryDate: null,
    createdAt: new Date().toISOString()
  };

  // Add shipment
  try {
    await docClient.send(new PutCommand({
      TableName: process.env.SHIPMENTS_TABLE,
      Item: sampleShipment
    }));
    console.log(`✅ Added shipment: ${sampleShipment.trackingNumber}`);
  } catch (error) {
    console.log(`❌ Error adding shipment:`, error.message);
  }

  // Verify data
  console.log('\n📊 Verifying data...\n');
  
  const couriersResult = await docClient.send(new ScanCommand({
    TableName: process.env.COURIERS_TABLE
  }));
  console.log(`✅ Total Couriers: ${couriersResult.Items.length}`);
  
  const shipmentsResult = await docClient.send(new ScanCommand({
    TableName: process.env.SHIPMENTS_TABLE
  }));
  console.log(`✅ Total Shipments: ${shipmentsResult.Items.length}`);

  console.log('\n🎉 Sample data added successfully!');
  console.log('💡 Refresh your browser to see the data in the UI');
}

addSampleData();
