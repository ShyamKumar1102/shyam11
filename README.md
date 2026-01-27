# Inventory Management Dashboard

A complete full-stack inventory management system built with React frontend and AWS serverless backend.

## 🏗️ Architecture

```
React Frontend (S3 + CloudFront)
        ↓
   API Gateway
        ↓
   AWS Lambda Functions
        ↓
   DynamoDB Tables
        ↓
   Amazon Cognito (Auth)
```

## 📁 Project Structure

```
INVENTORY/
├── frontend/              # React.js frontend with Vite
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── auth/      # Authentication components
│   │   │   ├── dashboard/ # Dashboard components
│   │   │   └── common/    # Shared components
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── package.json
├── backend/               # Legacy Node.js Express API (for local dev)
├── aws-backend/           # AWS Lambda serverless backend
│   ├── lambda/           # Lambda function handlers
│   │   ├── auth/         # Authentication functions
│   │   ├── products/     # Product management
│   │   ├── stock/        # Stock management
│   │   └── income/       # Income/Orders management
│   ├── dynamodb/         # DynamoDB table schemas
│   ├── api-gateway/      # API Gateway configuration
│   └── serverless.yml    # Serverless Framework config
├── DEPLOYMENT.md          # AWS deployment guide
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- AWS Account with DynamoDB access
- AWS CLI configured or AWS credentials

## Setup Instructions

### 1. AWS Configuration

1. Create an AWS account if you don't have one
2. Create an IAM user with DynamoDB permissions
3. Get your AWS Access Key ID and Secret Access Key

### 2. Local Development Setup

#### Quick Start (Windows)
1. Double-click `start.bat` to run both servers automatically

#### Manual Setup

#### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Edit the `.env` file with your AWS credentials:
   ```
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key_here
   AWS_SECRET_ACCESS_KEY=your_secret_key_here
   DYNAMODB_TABLE_NAME=inventory-items
   PORT=5000
   ```

3. Create the DynamoDB table (optional - for AWS integration):
   ```bash
   node create-table.js
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

#### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Start the React development server:
   ```bash
   npm run dev
   ```

3. Open your browser and go to `http://localhost:5173`

## ✨ Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Role-based access control (Admin/User)
- Secure password hashing

### 📊 Dashboard Overview
- Total stock summary
- Total income tracking
- Low stock alerts
- Real-time statistics

### 📦 Product Management
- Add new products with categories (A/B/C)
- Edit product details
- Delete products
- Barcode generation
- Product search and filtering

### 📋 Stock Management
- Add stock with location tracking
- Edit stock quantities
- Dispatch stock for orders
- Stock level monitoring
- Supplier and batch tracking

### 💰 Income Tracking
- Order management
- Income summary with date filtering
- Customer order history
- Revenue analytics
- Top-selling items report

### 🎨 UI/UX Features
- Clean, professional design
- Responsive layout (mobile-friendly)
- Collapsible sidebar navigation
- Real-time data updates
- Loading states and error handling
- Search and filter functionality

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `POST /auth/verify` - Verify JWT token

### Products
- `GET /products` - Get all products
- `GET /products/{id}` - Get single product
- `POST /products` - Create new product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### Stock
- `GET /stock` - Get all stock
- `GET /stock/product/{productId}` - Get stock by product
- `POST /stock` - Add stock
- `PUT /stock/{id}` - Update stock
- `POST /stock/{id}/dispatch` - Dispatch stock

### Orders/Income
- `GET /orders` - Get all orders
- `GET /orders/range` - Get orders by date range
- `POST /orders` - Create new order
- `GET /income/summary` - Get income summary

## 🛠️ Tech Stack

### Frontend
- **React 19** with JSX
- **Vite** for build tooling
- **React Router** for navigation
- **Lucide React** for icons
- **CSS3** with modern layouts
- **AWS Amplify** for authentication

### Backend (AWS Serverless)
- **AWS Lambda** (Node.js 18.x)
- **API Gateway** (REST API)
- **DynamoDB** (NoSQL database)
- **Amazon Cognito** (Authentication)
- **AWS S3** (Static hosting)
- **CloudFront** (CDN)
- **Serverless Framework** (Infrastructure as Code)

### Development Tools
- **JWT** for authentication
- **bcryptjs** for password hashing
- **AWS SDK v3**
- **ESLint** for code quality
- **Jest** for testing

## 🗄️ Database Schema

### DynamoDB Tables

1. **Users Table**
   - PK: `userId` (String)
   - GSI: `EmailIndex` on `email`
   - Attributes: name, email, password, role, isActive

2. **Products Table**
   - PK: `productId` (String)
   - GSI: `CategoryIndex` on `category`
   - Attributes: name, category, barcode, quantity, price

3. **Stock Table**
   - PK: `stockId` (String)
   - GSI: `ProductIndex` on `productId`
   - GSI: `LocationIndex` on `location`
   - Attributes: productId, itemName, quantity, location, supplier

4. **Orders Table**
   - PK: `orderId` (String)
   - GSI: `CustomerIndex` on `customerId` + `orderDate`
   - Attributes: customerId, items, orderValue, orderDate, status

## Development Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🚀 Deployment

For complete AWS deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

### Quick Deploy to AWS

1. **Deploy Backend**
   ```bash
   cd aws-backend
   npm install
   serverless deploy --stage prod
   ```

2. **Deploy Frontend**
   ```bash
   cd frontend
   npm run build
   aws s3 sync dist/ s3://your-bucket-name
   ```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
JWT_SECRET=your-super-secret-key
AWS_REGION=us-east-1
USERS_TABLE=inventory-users-prod
PRODUCTS_TABLE=inventory-products-prod
STOCK_TABLE=inventory-stock-prod
ORDERS_TABLE=inventory-orders-prod
```

#### Frontend (.env.production)
```env
VITE_API_BASE_URL=https://your-api-gateway-url.amazonaws.com/prod
VITE_AWS_REGION=us-east-1
```

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- API request validation
- CORS configuration
- AWS IAM permissions
- Input sanitization

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Collapsible sidebar for mobile
- Touch-friendly interface
- Optimized for all screen sizes

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd aws-backend
npm test

# Run linting
npm run lint
```

## 📈 Performance

- Serverless architecture for auto-scaling
- DynamoDB for fast NoSQL operations
- CloudFront CDN for global delivery
- Optimized React components
- Lazy loading and code splitting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check the [DEPLOYMENT.md](DEPLOYMENT.md) guide
2. Review AWS CloudWatch logs
3. Open an issue on GitHub

## 🔄 Version History

- **v1.0.0** - Initial release with full CRUD operations
- **v1.1.0** - Added AWS serverless backend
- **v1.2.0** - Enhanced UI/UX with professional design
- **v1.3.0** - Added authentication and role management