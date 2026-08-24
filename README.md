# RateNest - Store Rating Platform

A full-stack web application built for the **FullStack Intern Coding Challenge**. It allows users to browse stores, submit ratings, and manage the platform via role-based access control.

## Tech Stack
- **Backend:** ExpressJs (Node.js) + Prisma ORM
- **Database:** SQLite (Zero configuration needed)
- **Frontend:** ReactJs (Vite) + Tailwind CSS

## Prerequisites
- Node.js (v18+)

## Local Setup Instructions

### 1. Backend Setup
Open a terminal in the `backend` folder:
```bash
cd backend
npm install
# Set up the database schema
npx prisma db push
# Seed the database with default users and stores
npm run seed
# Start the development server
npm run dev
```

**Note on Database State:** 
The database is using SQLite. When you run `npm run seed`, it will automatically populate the local `dev.db` database with a System Administrator, Store Owners, Stores, and sample ratings so you can immediately test all role functionalities!

### 2. Frontend Setup
Open a second terminal in the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```

## Default Login Credentials (from Seed)
You can use these credentials to test the role-based dashboards:

**System Administrator:**
- **Email:** admin@storeratings.io
- **Password:** Admin@1234

**Store Owner:**
- **Email:** julian@artisancoffee.co
- **Password:** Owner@1234

**Normal User:**
- You can create a new user via the Registration page, or use:
- **Email:** maya.lin@gmail.com
- **Password:** User@1234

## Features Implemented
- **System Admin:** Add stores, users, and admins. Dashboard metrics, advanced table sorting, filtering, and detailed user/store metrics viewing.
- **Store Owner:** Track customer sentiment, see store average rating, total ratings, and customer breakdown.
- **Normal User:** Register, discover stores, search, filter, and submit/modify 1-5 star ratings.
- **Security:** JWT Authentication, Bcrypt password hashing, and strict form validations (Regex emails, complex passwords, max length addresses).
