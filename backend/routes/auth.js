const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const router = express.Router();

// Enhanced DynamoDB client with better error handling
const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Registration attempt:', { email: req.body.email, hasPassword: !!req.body.password });
    
    const { name, email, password } = req.body;
    
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }
    
    // Check if user exists - try both GSI and scan as fallback
    let existingUser;
    try {
      const existingUserQuery = new QueryCommand({
        TableName: process.env.USERS_TABLE,
        IndexName: 'EmailIndex',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: { ':email': email }
      });
      existingUser = await docClient.send(existingUserQuery);
    } catch (gsiError) {
      console.log('GSI query failed, using scan fallback:', gsiError.message);
      // Fallback to scan if GSI doesn't exist
      const scanCommand = new ScanCommand({
        TableName: process.env.USERS_TABLE,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: { ':email': email }
      });
      existingUser = await docClient.send(scanCommand);
    }
    
    if (existingUser.Items && existingUser.Items.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password with higher rounds for better security
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    console.log('Creating user in table:', process.env.USERS_TABLE);
    await docClient.send(new PutCommand({
      TableName: process.env.USERS_TABLE,
      Item: user
    }));
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret-change-in-production',
      { expiresIn: '24h' }
    );
    
    console.log('User registered successfully:', user.email);
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Registration error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.$metadata?.httpStatusCode,
      requestId: error.$metadata?.requestId
    });
    res.status(500).json({ 
      error: 'Registration failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', { email: req.body.email, hasPassword: !!req.body.password });
    
    const { email, password } = req.body;
    
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user - try both GSI and scan as fallback
    let result;
    try {
      const userQuery = new QueryCommand({
        TableName: process.env.USERS_TABLE,
        IndexName: 'EmailIndex',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: { ':email': email }
      });
      result = await docClient.send(userQuery);
    } catch (gsiError) {
      console.log('GSI query failed, using scan fallback:', gsiError.message);
      // Fallback to scan if GSI doesn't exist
      const scanCommand = new ScanCommand({
        TableName: process.env.USERS_TABLE,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: { ':email': email }
      });
      result = await docClient.send(scanCommand);
    }
    
    if (!result.Items || result.Items.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.Items[0];
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret-change-in-production',
      { expiresIn: '24h' }
    );
    
    console.log('User logged in successfully:', user.email);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.$metadata?.httpStatusCode,
      requestId: error.$metadata?.requestId
    });
    res.status(500).json({ 
      error: 'Login failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;