# Ticket Box Server

A robust backend service for an event ticketing web application. This server provides APIs for event management, ticket purchasing, user authentication, and payment processing.

## Technologies

- **Node.js & Express**: Server framework
- **TypeScript**: Programming language for type safety
- **MongoDB & Mongoose**: Database and ODM
- **Redis & BullMQ**: Queue management for background tasks
- **JWT**: Authentication and authorization
- **Nodemailer**: Email services
- **Cloudinary**: Image uploading and storage
- **VNPay**: Payment integration
- **Winston & Morgan**: Logging
- **Joi**: Request validation
- **QRCode**: Ticket QR code generation

## Features

- **User Management**: Registration, authentication, and profile management
- **Event Management**: Create, view, update, and delete events
- **Show Management**: Schedule shows for events
- **Ticket Management**: Create ticket types, purchase tickets
- **Order Processing**: Create and manage orders
- **Payment Integration**: Process payments through VNPay
- **Voucher System**: Create and apply discount vouchers
- **Email Notifications**: Send confirmation emails and reminders
- **QR Code Generation**: Generate QR codes for tickets
- **Background Processing**: Queue-based processing for emails and notifications

## Project Structure

```
src/
├── @types/           # TypeScript type definitions
├── config/           # Configuration files
├── constants/        # Application constants
├── controllers/      # Request handlers
├── middlewares/      # Express middleware
├── models/           # MongoDB models
├── queues/           # BullMQ queue definitions and workers
├── routes/           # API routes
├── services/         # Business logic
├── templates/        # Email templates
├── utils/            # Utility functions
├── validations/      # Input validation schemas
└── server.ts         # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB
- Redis
- VNPay account (for payment processing)
- Cloudinary account (for image storage)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/ticket-box.git
   cd ticket-box/ticket-box-server
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```
   # Server
   NODE_ENV=development
   SERVER_HOST=http://localhost
   SERVER_PORT=3000

   # MongoDB
   MONGO_URI=mongodb://localhost:27017/event-ticketing-db

   # Redis
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=password

   # Email
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-password

   # JWT
   JWT_ACCESS_SECRET=your-access-secret
   JWT_ACCESS_EXPIRY=1d
   JWT_REFRESH_SECRET=your-refresh-secret
   JWT_REFRESH_EXPIRY=15d

   # Encryption
   ENCRYPT_IV_LENGTH=16
   ENCRYPT_KEY=your-encrypt-key

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # VNPay
   VNPAY_TMN_CODE=your-tmn-code
   VNPAY_SECURE_SECRET=your-secure-secret

   # Logging
   LOG_LEVEL=info
   ```

### Running the Application

#### Development Mode

```
npm run dev
```

#### Production Build

```
npm run build
npm start
```

### API Endpoints

- **Auth**

  - POST `/api/v1/auth/register` - Register new user
  - POST `/api/v1/auth/login` - Login user
  - POST `/api/v1/auth/refresh-token` - Refresh access token

- **Users**

  - GET `/api/v1/users/me` - Get current user
  - PATCH `/api/v1/users/me` - Update current user

- **Events**

  - GET `/api/v1/events` - Get all events
  - POST `/api/v1/events` - Create new event
  - GET `/api/v1/events/:id` - Get event by ID
  - PUT `/api/v1/events/:id` - Update event
  - DELETE `/api/v1/events/:id` - Delete event

- **Shows**

  - GET `/api/v1/events/:eventId/shows` - Get all shows for an event
  - POST `/api/v1/events/:eventId/shows` - Create new show for an event

- **Tickets**

  - GET `/api/v1/tickets` - Get all tickets
  - POST `/api/v1/tickets` - Create new ticket
  - GET `/api/v1/tickets/:id` - Get ticket by ID

- **Orders**

  - GET `/api/v1/orders` - Get all orders
  - POST `/api/v1/orders` - Create new order
  - GET `/api/v1/orders/:id` - Get order by ID

- **Payments**

  - POST `/api/v1/payment/create` - Create payment
  - GET `/api/v1/payment/vnpay_return` - VNPay payment callback

- **Vouchers**
  - GET `/api/v1/vouchers` - Get all vouchers
  - POST `/api/v1/vouchers` - Create new voucher
  - GET `/api/v1/vouchers/:id` - Get voucher by ID
