# Store Rating Platform

A full-stack Store Rating Platform built with React.js, Node.js, Express.js, and MySQL. The application allows users to browse stores, submit ratings, and manage stores through role-based dashboards.

## Tech Stack

### Frontend

* React.js
* React Router DOM
* Material UI
* Axios

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt

### Database

* MySQL

---

# Prerequisites

Before running the application, make sure you have installed:

* Node.js (v18 or later)
* npm
* MySQL Server
* Git

Verify installation:

```bash
node -v
npm -v
mysql --version
```

---

# Project Structure

```text
Store-Rating-Application/
│
├── backend/
│
└── frontend/
```

---

# Database Setup

## Step 1: Create Database

Open MySQL and run:

```sql
CREATE DATABASE store_rating_db;
```

---

## Step 2: Import Database

If a SQL file is provided:

```sql
SOURCE path/to/database.sql;
```

Example:

```sql
SOURCE D:/Projects/Store-Rating-Application/backend/database.sql;
```

---

# Update Database Configuration

Open the database configuration file.

Example:

```text
backend/src/config/db.js
```

Update the following values according to your local MySQL setup:

```javascript
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "YOUR_MYSQL_PASSWORD",
    database: "store_rating_db"
});
```

Replace:

* YOUR_MYSQL_PASSWORD → your MySQL password
* store_rating_db → your database name

---

# Backend Setup

Navigate to backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start backend server:

```bash
npm start
```

or

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

---

# Frontend Setup

Navigate to frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start React application:

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

# Login Credentials

## Admin

```text
Email: admin@example.com
Password: Admin@123
```

## Store Owner

```text
Email: owner@example.com
Password: Owner@123
```

## User

```text
Email: user@example.com
Password: User@123
```

Note:
Update these credentials according to your seeded database records.

---

# Features

## Administrator

* Manage Users
* Manage Stores
* View Dashboard Statistics
* Search, Filter, Sort, and Pagination

## Normal User

* Register and Login
* Browse Stores
* Submit Ratings
* Update Ratings

## Store Owner

* View Store Ratings
* View Users Who Rated Store
* Monitor Average Rating

---

# API Configuration

If frontend API URL needs to be changed:

Open:

```text
frontend/src/services/api.js
```

Update:

```javascript
const API_BASE_URL = "http://localhost:5000/api";
```

---

# Common Commands

Install Dependencies

```bash
npm install
```

Start Backend

```bash
cd backend
npm run dev
```

Start Frontend

```bash
cd frontend
npm run dev
```

---

# Troubleshooting

### MySQL Connection Error

Verify:

* MySQL service is running
* Database exists
* Username and password are correct

### Port Already in Use

Change backend port inside:

```text
backend/.env
```

Example:

```env
PORT=5001
```

### Module Not Found

Run:

```bash
npm install
```

again inside the corresponding project folder.

---

# Author

Parag Lakade

Java Full Stack Developer

Built as part of a Full Stack Intern Coding Challenge.
