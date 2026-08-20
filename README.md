# Inventory Management System

A modern, full-stack Inventory Management System built with **React, Node.js, Express.js, and MongoDB**. The application provides a responsive SaaS-style admin dashboard for managing products, inventory, authentication, and business operations.

## 🚀 Features

* 🔐 JWT-based authentication
* 👤 Secure user authentication with bcrypt
* 📦 Product and inventory management
* 📊 Interactive admin dashboard
* 📈 Sales and inventory analytics
* 🔍 Search and filtering
* 📝 Form validation
* 🖼️ Product image upload
* 🔔 Toast notifications
* 📱 Responsive design
* 🗂️ RESTful API architecture
* 🛡️ Protected routes
* 💾 MongoDB database integration
* ⚡ Fast Vite development environment
* 🎨 Modern SaaS-style UI

## 🛠️ Tech Stack

### Frontend

* React 19
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* React Icons
* Framer Motion
* Recharts
* React Hot Toast
* React Hook Form
* Context API

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Multer
* dotenv
* CORS

## 📁 Project Structure

```text
inventory-management-system/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── assets/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── uploads/
│   ├── seed.js
│   ├── index.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🔐 Authentication

The application uses JWT-based authentication.

Authentication flow:

```text
User Login
    ↓
Frontend sends credentials
    ↓
Express API
    ↓
Credentials validated
    ↓
JWT token generated
    ↓
Token stored by frontend
    ↓
Protected dashboard access
```

Passwords are securely hashed using **bcrypt** before being stored in the database.

## 🗄️ Database

The application uses **MongoDB** with **Mongoose** for database management.

The database stores application data such as:

* Users
* Products
* Inventory information
* Other application-related records

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/aakritiikarna/inventory-management-system.git
```

### 2. Navigate into the project

```bash
cd inventory-management-system
```

## 🔧 Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/pos-db
JWT_SECRET=your_jwt_secret
```

Start the backend server:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:3000
```

## 💻 Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

## 🔑 Environment Variables

Never commit your `.env` file to GitHub.

Example backend environment variables:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Make sure `.env` is included in `.gitignore`.

## 🔄 Application Architecture

```text
                    ┌─────────────────────┐
                    │      React UI       │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                             Axios
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Express.js API   │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
              Authentication         Business Logic
                    │                     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      MongoDB        │
                    │      Database       │
                    └─────────────────────┘
```

## 📊 Dashboard

The admin dashboard provides a centralized interface for monitoring and managing inventory-related operations.

It is designed with a modern SaaS dashboard approach and focuses on:

* Clear data visualization
* Responsive layouts
* Easy navigation
* Reusable components
* Interactive charts
* Efficient inventory management

## 🧪 Development

Frontend:

```bash
cd frontend
npm run dev
```

Backend:

```bash
cd backend
npm run dev
```

Build the frontend:

```bash
cd frontend
npm run build
```

## 🔒 Security Considerations

The project follows several common security practices:

* Password hashing with bcrypt
* JWT authentication
* Protected API routes
* Environment variables for sensitive configuration
* CORS configuration
* Input validation
* Sensitive files excluded through `.gitignore`

## 🚧 Future Improvements

Possible future enhancements include:

* Role-based access control
* Advanced sales management
* Purchase and supplier management
* Low-stock notifications
* Export reports to PDF/Excel
* Advanced analytics
* Cloud image storage
* Automated testing
* Docker support
* Production deployment
* CI/CD pipeline

## 📸 Screenshots

Screenshots of the dashboard and major application pages can be added here.

```text
Add project screenshots here
```

## 🌐 Live Demo

Coming soon.

## 📌 Project Status

**Portfolio Project — Actively maintained**

The project is being developed with a focus on modern full-stack development practices, responsive UI design, RESTful APIs, authentication, database integration, and production-oriented architecture.

## 👩‍💻 Author

**Aakriti Karna**

GitHub:
https://github.com/aakritiikarna

## ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.
