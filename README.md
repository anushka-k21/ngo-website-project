# NGO Donation Management System

## Features
### User Features
- User registration & login (JWT based authentication)  
- Secure dashboard showing:  
- Personal details  
- Donation history with status (PENDING / SUCCESS / FAILED)  
- Online donation using Razorpay Payment Gateway   
- Logout functionality  

###  Admin Features
- Admin dashboard  
- View all donations  
- View registered users  
- Role-based access control for security  

###  Payment Features
- Razorpay order creation  
- Secure payment verification   
- Real-time update of donation status    
- Payment history stored in PostgreSQL  
  
## Tech Stack
### Frontend
- React.js  
- React Router  
- Axios  
- Razorpay Checkout SDK  
- Inline CSS styling  

### Backend
- Node.js  
- Express.js  
- JWT Authentication  
- Razorpay Node SDK  

### Database
- PostgreSQL  

## Project Structure
```ngo/
│
├── ngo-frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── login.js
│   │   │   ├── donate.js
│   │   │   ├── userDashboard.js
│   │   │   └── adminDashboard.js
│   │   ├── routes/
│   │   │   ├── privateRoute.js
│   │   │   └── roleRoute.js
│   │   └── services/api.js
│   └── public/index.html
│
├── ngo-backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── donationController.js
│   │   │   └── paymentController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── donationRoutes.js
│   │   │   ├── paymentRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── middleware/authMiddleware.js
│   │   ├── config/db.js
│   │   ├── app.js
│   │   └── server.js
│
└── README.md
```

## ⚙️ Environment Variables

Create a .env file in ngo-backend:  
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=ngo_db
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxxxxx
```

## 🛠 Installation & Setup
### 1️⃣ Clone the Repository  
```
git clone https://github.com/your-username/ngo-donation-system.git
cd ngo-donation-system
```

2️⃣ Backend Setup
```
cd ngo-backend
npm install
npm start
```


Backend runs on:  

`http://localhost:5000`

3️⃣ Frontend Setup
```
cd ngo-frontend
npm install
npm start
```


## Frontend runs on:  
`http://localhost:3000`

## API Endpoints
Authentication  
POST `/api/auth/register`   
POST `/api/auth/login`  

## Donations  
GET  `/api/donations/my`    
## Payments
POST `/api/payment/create-order`  
POST `/api/payment/verify`  


