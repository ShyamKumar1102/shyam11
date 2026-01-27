const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.PRODUCTS_TABLE || 'Products';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

// Get all products
exports.getProducts = async (event) => {
  try {
    const params = {
      TableName: TABLE_NAME
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
    console.error('Error getting products:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Failed to get products'
      })
    };
  }
};

// Get single product
exports.getProduct = async (event) => {
  try {
    const { productId } = event.pathParameters;

    const params = {
      TableName: TABLE_NAME,
      Key: { productId }
    };

    const result = await dynamodb.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'Product not found'
        })
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: result.Item
      })
    };
  } catch (error) {
    console.error('Error getting product:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Failed to get product'
      })
    };
  }
};

// Create product
exports.createProduct = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { name, category, barcode, quantity, price } = body;

    // Validation
    if (!name || !category || !barcode || quantity === undefined || price === undefined) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields'
        })
      };
    }

    const productId = body.productId || `P${Date.now()}`;
    const timestamp = new Date().toISOString();

    const product = {
      productId,
      name,
      category,
      barcode,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const params = {
      TableName: TABLE_NAME,
      Item: product,
      ConditionExpression: 'attribute_not_exists(productId)'
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: product
      })
    };
  } catch (error) {
    console.error('Error creating product:', error);
    
    if (error.code === 'ConditionalCheckFailedException') {
      return {
        statusCode: 409,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'Product ID already exists'
        })
      };
    }

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Failed to create product'
      })
    };
  }
};

// Update product
exports.updateProduct = async (event) => {
  try {
    const { productId } = event.pathParameters;
    const body = JSON.parse(event.body);
    const { name, category, barcode, quantity, price } = body;

    const timestamp = new Date().toISOString();

    const params = {
      TableName: TABLE_NAME,
      Key: { productId },
      UpdateExpression: 'SET #name = :name, category = :category, barcode = :barcode, quantity = :quantity, price = :price, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': name,
        ':category': category,
        ':barcode': barcode,
        ':quantity': parseInt(quantity),
        ':price': parseFloat(price),
        ':updatedAt': timestamp
      },
      ReturnValues: 'ALL_NEW',
      ConditionExpression: 'attribute_exists(productId)'
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
    console.error('Error updating product:', error);
    
    if (error.code === 'ConditionalCheckFailedException') {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'Product not found'
        })
      };
    }

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Failed to update product'
      })
    };
  }
};

// Delete product
exports.deleteProduct = async (event) => {
  try {
    const { productId } = event.pathParameters;

    const params = {
      TableName: TABLE_NAME,
      Key: { productId },
      ConditionExpression: 'attribute_exists(productId)'
    };

    await dynamodb.delete(params).promise();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: 'Product deleted successfully'
      })
    };
  } catch (error) {
    console.error('Error deleting product:', error);
    
    if (error.code === 'ConditionalCheckFailedException') {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'Product not found'
        })
      };
    }

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Failed to delete product'
      })
    };
  }
};