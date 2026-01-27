const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();

const USERS_TABLE = process.env.USERS_TABLE || 'Users';
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';
const USER_POOL_ID = process.env.USER_POOL_ID;
const CLIENT_ID = process.env.CLIENT_ID;

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

// Register user
exports.register = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { name, email, password } = body;

    // Validation
    if (!name || !email || !password) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields: name, email, password'
        })
      };
    }

    // Check if user already exists
    const existingUserParams = {
      TableName: USERS_TABLE,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    };

    const existingUser = await dynamodb.query(existingUserParams).promise();
    if (existingUser.Items.length > 0) {
      return {
        statusCode: 409,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'User already exists'
        })
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `U${Date.now()}`;
    const timestamp = new Date().toISOString();

    // Create user in DynamoDB
    const user = {
      userId,
      name,
      email,
      password: hashedPassword,
      role: 'user', // Default role
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const params = {
      TableName: USERS_TABLE,
      Item: user
    };

    await dynamodb.put(params).promise();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId, 
        email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    delete user.password;

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: {
          user,
          token
        }
      })
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Failed to register user'
      })
    };
  }
};

// Login user
exports.login = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields: email, password'
        })
      };
    }

    // Get user by email
    const params = {
      TableName: USERS_TABLE,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    };

    const result = await dynamodb.query(params).promise();
    if (result.Items.length === 0) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'Invalid credentials'
        })
      };
    }

    const user = result.Items[0];

    // Check if user is active
    if (!user.isActive) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'Account is deactivated'
        })
      };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'Invalid credentials'
        })
      };
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.userId, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Update last login
    const updateParams = {
      TableName: USERS_TABLE,
      Key: { userId: user.userId },
      UpdateExpression: 'SET lastLogin = :lastLogin',
      ExpressionAttributeValues: {
        ':lastLogin': new Date().toISOString()
      }
    };

    await dynamodb.update(updateParams).promise();

    // Remove password from response
    delete user.password;

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: {
          user,
          token
        }
      })
    };
  } catch (error) {
    console.error('Error logging in user:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Failed to login'
      })
    };
  }
};

// Verify JWT token middleware
exports.verifyToken = async (event) => {
  try {
    const token = event.headers.Authorization?.replace('Bearer ', '');

    if (!token) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'No token provided'
        })
      };
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user details
    const params = {
      TableName: USERS_TABLE,
      Key: { userId: decoded.userId }
    };

    const result = await dynamodb.get(params).promise();
    if (!result.Item) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'Invalid token'
        })
      };
    }

    const user = result.Item;
    delete user.password;

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: {
          user,
          decoded
        }
      })
    };
  } catch (error) {
    console.error('Error verifying token:', error);
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Invalid token'
      })
    };
  }
};

// Get user profile
exports.getProfile = async (event) => {
  try {
    const token = event.headers.Authorization?.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);

    const params = {
      TableName: USERS_TABLE,
      Key: { userId: decoded.userId }
    };

    const result = await dynamodb.get(params).promise();
    if (!result.Item) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'User not found'
        })
      };
    }

    const user = result.Item;
    delete user.password;

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: user
      })
    };
  } catch (error) {
    console.error('Error getting profile:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Failed to get profile'
      })
    };
  }
};