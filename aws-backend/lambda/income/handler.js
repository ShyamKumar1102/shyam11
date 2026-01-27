const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const ORDERS_TABLE = process.env.ORDERS_TABLE || 'Orders';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

// Get all orders/income
exports.getOrders = async (event) => {
  try {
    const params = {
      TableName: ORDERS_TABLE
    };

    const result = await dynamodb.scan(params).promise();

    // Calculate total income
    const totalIncome = result.Items.reduce((sum, order) => sum + (order.orderValue || 0), 0);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: {
          orders: result.Items,
          totalIncome,
          totalOrders: result.Items.length
        }
      })
    };
  } catch (error) {
    console.error('Error getting orders:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Failed to get orders'
      })
    };
  }
};

// Get orders by date range
exports.getOrdersByDateRange = async (event) => {
  try {
    const { startDate, endDate } = event.queryStringParameters || {};

    let params = {
      TableName: ORDERS_TABLE
    };

    if (startDate && endDate) {
      params.FilterExpression = 'orderDate BETWEEN :startDate AND :endDate';
      params.ExpressionAttributeValues = {
        ':startDate': startDate,
        ':endDate': endDate
      };
    }

    const result = await dynamodb.scan(params).promise();

    // Calculate metrics
    const totalIncome = result.Items.reduce((sum, order) => sum + (order.orderValue || 0), 0);
    const avgOrderValue = result.Items.length > 0 ? totalIncome / result.Items.length : 0;

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: {
          orders: result.Items,
          metrics: {
            totalIncome,
            totalOrders: result.Items.length,
            avgOrderValue
          }
        }
      })
    };
  } catch (error) {
    console.error('Error getting orders by date range:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Failed to get orders by date range'
      })
    };
  }
};

// Create order
exports.createOrder = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { customerId, customerName, items, orderValue } = body;

    // Validation
    if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields: customerId, items'
        })
      };
    }

    const orderId = `O${Date.now()}`;
    const timestamp = new Date().toISOString();
    const orderDate = timestamp.split('T')[0]; // YYYY-MM-DD format

    // Calculate total if not provided
    const calculatedValue = orderValue || items.reduce((sum, item) => {
      return sum + (item.quantity * item.price);
    }, 0);

    const order = {
      orderId,
      customerId,
      customerName: customerName || `Customer ${customerId}`,
      items,
      orderValue: calculatedValue,
      orderDate,
      status: 'completed',
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const params = {
      TableName: ORDERS_TABLE,
      Item: order
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: order
      })
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Failed to create order'
      })
    };
  }
};

// Get income summary
exports.getIncomeSummary = async (event) => {
  try {
    const params = {
      TableName: ORDERS_TABLE
    };

    const result = await dynamodb.scan(params).promise();

    // Group by date
    const dailyIncome = {};
    const monthlyIncome = {};
    let totalIncome = 0;

    result.Items.forEach(order => {
      const orderDate = order.orderDate;
      const orderValue = order.orderValue || 0;
      const month = orderDate.substring(0, 7); // YYYY-MM

      totalIncome += orderValue;

      // Daily income
      if (!dailyIncome[orderDate]) {
        dailyIncome[orderDate] = 0;
      }
      dailyIncome[orderDate] += orderValue;

      // Monthly income
      if (!monthlyIncome[month]) {
        monthlyIncome[month] = 0;
      }
      monthlyIncome[month] += orderValue;
    });

    // Get top selling items
    const itemSales = {};
    result.Items.forEach(order => {
      order.items.forEach(item => {
        if (!itemSales[item.itemName]) {
          itemSales[item.itemName] = {
            itemName: item.itemName,
            totalQuantity: 0,
            totalValue: 0
          };
        }
        itemSales[item.itemName].totalQuantity += item.quantity;
        itemSales[item.itemName].totalValue += item.quantity * item.price;
      });
    });

    const topItems = Object.values(itemSales)
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 5);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: {
          totalIncome,
          totalOrders: result.Items.length,
          avgOrderValue: result.Items.length > 0 ? totalIncome / result.Items.length : 0,
          dailyIncome,
          monthlyIncome,
          topSellingItems: topItems
        }
      })
    };
  } catch (error) {
    console.error('Error getting income summary:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Failed to get income summary'
      })
    };
  }
};