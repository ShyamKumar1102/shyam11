const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api';
let authToken = '';
let testProductId = '';
let testStockId = '';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

function log(status, message) {
  const icon = status === 'pass' ? '✓' : status === 'fail' ? '✗' : '→';
  const color = status === 'pass' ? colors.green : status === 'fail' ? colors.red : colors.yellow;
  console.log(`${color}${icon} ${message}${colors.reset}`);
}

async function testHealthCheck() {
  try {
    const res = await axios.get(`${BASE_URL}/health`);
    log('pass', 'Health check passed');
    return true;
  } catch (error) {
    log('fail', `Health check failed: ${error.message}`);
    return false;
  }
}

async function testRegister() {
  try {
    const res = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test User',
      email: `test${Date.now()}@test.com`,
      password: 'Test123!',
      role: 'admin'
    });
    log('pass', 'User registration passed');
    return true;
  } catch (error) {
    log('fail', `Registration failed: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function testLogin() {
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@test.com',
      password: 'admin123'
    });
    authToken = res.data.token;
    log('pass', 'Login passed');
    return true;
  } catch (error) {
    log('fail', `Login failed: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function testCreateProduct() {
  try {
    const res = await axios.post(`${BASE_URL}/products`, {
      name: 'Test Product',
      category: 'A',
      price: 100,
      quantity: 50
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    testProductId = res.data.productId;
    log('pass', 'Create product passed');
    return true;
  } catch (error) {
    log('fail', `Create product failed: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function testGetProducts() {
  try {
    const res = await axios.get(`${BASE_URL}/products`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    log('pass', `Get products passed (${res.data.length} items)`);
    return true;
  } catch (error) {
    log('fail', `Get products failed: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function testAddStock() {
  try {
    const res = await axios.post(`${BASE_URL}/stock`, {
      productId: testProductId,
      itemName: 'Test Product',
      quantity: 100,
      location: 'Warehouse A',
      supplier: 'Test Supplier'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    testStockId = res.data.stockId;
    log('pass', 'Add stock passed');
    return true;
  } catch (error) {
    log('fail', `Add stock failed: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function testGetStock() {
  try {
    const res = await axios.get(`${BASE_URL}/stock`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    log('pass', `Get stock passed (${res.data.length} items)`);
    return true;
  } catch (error) {
    log('fail', `Get stock failed: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function testCreateOrder() {
  try {
    const res = await axios.post(`${BASE_URL}/orders`, {
      customerId: 'test-customer',
      customerName: 'Test Customer',
      items: [{
        productId: testProductId,
        itemName: 'Test Product',
        quantity: 5,
        price: 100
      }],
      orderValue: 500
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    log('pass', 'Create order passed');
    return true;
  } catch (error) {
    log('fail', `Create order failed: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function testGetOrders() {
  try {
    const res = await axios.get(`${BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    log('pass', `Get orders passed (${res.data.length} items)`);
    return true;
  } catch (error) {
    log('fail', `Get orders failed: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('\n🧪 Starting Inventory Management System Tests\n');
  
  const results = {
    passed: 0,
    failed: 0
  };

  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'User Registration', fn: testRegister },
    { name: 'User Login', fn: testLogin },
    { name: 'Create Product', fn: testCreateProduct },
    { name: 'Get Products', fn: testGetProducts },
    { name: 'Add Stock', fn: testAddStock },
    { name: 'Get Stock', fn: testGetStock },
    { name: 'Create Order', fn: testCreateOrder },
    { name: 'Get Orders', fn: testGetOrders }
  ];

  for (const test of tests) {
    log('info', `Testing: ${test.name}`);
    const result = await test.fn();
    if (result) results.passed++;
    else results.failed++;
    console.log('');
  }

  console.log('\n📊 Test Results:');
  console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
  console.log(`Total: ${results.passed + results.failed}\n`);
}

runTests().catch(console.error);
