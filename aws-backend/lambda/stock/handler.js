const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const STOCK_TABLE = process.env.STOCK_TABLE || 'Stock';
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE || 'Products';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

// Get all stock
exports.getStock = async (event) => {
  try {
    const params = {
      TableName: STOCK_TABLE
    };

    const result = await dynamodb.scan(params).promise();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: result.Items
      })
    };
  } catch (error) {
    console.error('Error getting stock:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Failed to get stock'
      })
    };
  }
};

// Get stock by product
exports.getStockByProduct = async (event) => {
  try {
    const { productId } = event.pathParameters;

    const params = {
      TableName: STOCK_TABLE,
      IndexName: 'ProductIndex',
      KeyConditionExpression: 'productId = :productId',
      ExpressionAttributeValues: {
        ':productId': productId
      }
    };

    const result = await dynamodb.query(params).promise();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: result.Items
      })
    };
  } catch (error) {
    console.error('Error getting stock by product:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Failed to get stock by product'
      })
    };
  }
};

// Add stock
exports.addStock = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { productId, quantity, location, supplier, batchNumber, expiryDate } = body;

    // Validation
    if (!productId || !quantity || !location) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields: productId, quantity, location'
        })
      };
    }

    // Verify product exists
    const productParams = {
      TableName: PRODUCTS_TABLE,
      Key: { productId }
    };

    const productResult = await dynamodb.get(productParams).promise();
    if (!productResult.Item) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'Product not found'
        })
      };
    }

    const stockId = `S${Date.now()}`;
    const timestamp = new Date().toISOString();

    const stockItem = {
      stockId,
      productId,
      itemName: productResult.Item.name,
      quantity: parseInt(quantity),
      location,
      supplier: supplier || '',
      batchNumber: batchNumber || '',
      expiryDate: expiryDate || '',
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const params = {
      TableName: STOCK_TABLE,
      Item: stockItem
    };

    await dynamodb.put(params).promise();

    // Update product quantity
    const updateProductParams = {
      TableName: PRODUCTS_TABLE,
      Key: { productId },
      UpdateExpression: 'ADD quantity :quantity SET updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':quantity': parseInt(quantity),
        ':updatedAt': timestamp
      }
    };

    await dynamodb.update(updateProductParams).promise();

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: stockItem
      })
    };
  } catch (error) {
    console.error('Error adding stock:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Failed to add stock'
      })
    };
  }
};

// Update stock
exports.updateStock = async (event) => {
  try {
    const { stockId } = event.pathParameters;
    const body = JSON.parse(event.body);
    const { quantity, location, supplier, batchNumber, expiryDate } = body;

    const timestamp = new Date().toISOString();

    const params = {
      TableName: STOCK_TABLE,
      Key: { stockId },
      UpdateExpression: 'SET quantity = :quantity, #location = :location, supplier = :supplier, batchNumber = :batchNumber, expiryDate = :expiryDate, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#location': 'location'
      },
      ExpressionAttributeValues: {
        ':quantity': parseInt(quantity),
        ':location': location,
        ':supplier': supplier || '',
        ':batchNumber': batchNumber || '',
        ':expiryDate': expiryDate || '',
        ':updatedAt': timestamp
      },
      ReturnValues: 'ALL_NEW',
      ConditionExpression: 'attribute_exists(stockId)'
    };

    const result = await dynamodb.update(params).promise();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: result.Attributes
      })
    };
  } catch (error) {
    console.error('Error updating stock:', error);
    
    if (error.code === 'ConditionalCheckFailedException') {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'Stock not found'
        })
      };
    }

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Failed to update stock'
      })
    };
  }
};

// Dispatch stock
exports.dispatchStock = async (event) => {
  try {
    const { stockId } = event.pathParameters;
    const body = JSON.parse(event.body);
    const { quantity, orderId, customerId } = body;

    if (!quantity || !orderId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields: quantity, orderId'
        })
      };
    }

    // Get current stock
    const getParams = {
      TableName: STOCK_TABLE,
      Key: { stockId }
    };

    const stockResult = await dynamodb.get(getParams).promise();
    if (!stockResult.Item) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'Stock not found'
        })
      };
    }

    const currentStock = stockResult.Item;
    const dispatchQuantity = parseInt(quantity);

    if (currentStock.quantity < dispatchQuantity) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'Insufficient stock quantity'
        })
      };
    }

    const timestamp = new Date().toISOString();
    const newQuantity = currentStock.quantity - dispatchQuantity;

    // Update stock quantity
    const updateParams = {
      TableName: STOCK_TABLE,
      Key: { stockId },
      UpdateExpression: 'SET quantity = :quantity, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':quantity': newQuantity,
        ':updatedAt': timestamp
      },
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamodb.update(updateParams).promise();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: 'Stock dispatched successfully',
        data: {
          ...result.Attributes,
          dispatchedQuantity: dispatchQuantity,
          orderId
        }
      })
    };
  } catch (error) {
    console.error('Error dispatching stock:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Failed to dispatch stock'
      })
    };
  }
};