# 📦 Inventory Management System

A complete full-stack inventory management system built with React and AWS.

## 🚀 Live Demo
- **Frontend**: [Deploy on Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/inventory-management)
- **Backend**: AWS Lambda + DynamoDB

## ✨ Features
- 🔐 User Authentication & Authorization
- 📦 Product Management with Barcode Generation
- 📊 Stock Management & Location Tracking
- 💰 Order Processing & Income Tracking
- 👥 Customer & Supplier Management
- 📄 Invoice Generation & Billing
- 🚚 Dispatch & Shipment Tracking
- 📱 Mobile-Responsive Design
- ☁️ AWS Cloud Integration

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, Lucide Icons
- **Backend**: Node.js, Express.js, AWS DynamoDB
- **Authentication**: JWT + bcrypt
- **Deployment**: Netlify + AWS Lambda

## 🚀 Quick Deploy

### Deploy Frontend to Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/inventory-management)

### Local Development
```bash
# Clone repository
git clone https://github.com/yourusername/inventory-management.git
cd inventory-management

# Setup AWS credentials
setup-aws.bat

# Start development servers
launch.bat
```

## 📁 Project Structure
```
inventory-management/
├── frontend/          # React application
├── backend/           # Express.js API
├── aws-backend/       # AWS Lambda functions
└── docs/             # Documentation
```

## 🌐 Environment Variables
```env
# Frontend (.env.production)
VITE_API_BASE_URL=https://your-api-url.com/api

# Backend (.env)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
JWT_SECRET=your-jwt-secret
```

## 📚 Documentation
- [Quick Start Guide](QUICK_START.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Project Status](PROJECT_STATUS.md)

## 🤝 Contributing
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License
MIT License - see [LICENSE](LICENSE) file

## 🆘 Support
- 📧 Email: support@inventory-system.com
- 📖 Documentation: [Wiki](https://github.com/yourusername/inventory-management/wiki)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/inventory-management/issues)