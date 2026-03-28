
# Emergency Resource Locator and Response System

A microservices-based MERN application for reporting emergencies, tracking response progress, and enabling administrative oversight through a centralized dashboard.

## Table of Contents

- Overview
- Features
- System Architecture
- Tech Stack
- Project Structure
- Service Ports
- Prerequisites
- Running with Docker
- Running Locally
- Environment Variables
- API Documentation
- User Roles and Access Control
- Frontend Routes
- Troubleshooting
- Future Improvements

## Overview

This project is designed for campus emergency operations and resource coordination. It separates responsibilities into multiple backend services behind an API Gateway, with a React frontend consuming only gateway routes.

Core capabilities include:
- User registration and login
- Authenticated emergency report submission
- Request lifecycle tracking
- Admin-only global statistics and user management views

## Features

- Authentication with JWT tokens
- Role-based authorization (user and admin)
- Emergency request creation with required and optional fields
- Status transitions across pending, in-progress, and completed
- Admin dashboard for statistics and users list
- API Gateway as single entry point for frontend calls
- Dockerized full-stack deployment

## System Architecture

```mermaid
graph TD
        Frontend[React Frontend :5173] --> Gateway[API Gateway :5000]
        Gateway --> AuthService[Auth Service :5001]
        Gateway --> EmergencyService[Emergency Service :5002]
        Gateway --> AdminService[Admin Service :5003]
        AuthService --> Mongo[(MongoDB)]
        EmergencyService --> Mongo
        AdminService --> Mongo
```

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Axios (service-to-service and gateway proxying)

### Infrastructure
- MongoDB
- Docker and Docker Compose

## Project Structure

```text
Emergency-Response-main/
    backend/
        api-gateway/
        auth-service/
        emergency-service/
        admin-service/
        middleware/
    frontend/
    docker-compose.yml
    README.md
```

## Service Ports

- Frontend (Vite dev): 5173
- Frontend (Docker): 80
- API Gateway: 5000
- Auth Service: 5001
- Emergency Service: 5002
- Admin Service: 5003
- MongoDB: 27017

## Prerequisites

- Node.js 18 or above
- npm
- MongoDB running locally (if not using Docker)
- Docker Desktop (optional, recommended for easiest setup)

## Running with Docker

From project root:

```bash
docker compose up --build
```

After startup:
- Frontend: http://localhost
- API Gateway: http://localhost:5000
- Gateway health: http://localhost:5000/health

## Running Locally

Use separate terminals for each service.

### 1. Install dependencies

```bash
cd backend/auth-service
npm install

cd ../emergency-service
npm install

cd ../admin-service
npm install

cd ../api-gateway
npm install

cd ../../frontend
npm install
```

### 2. Configure environment variables

Create .env files in backend services as needed.

Minimum requirement:
- auth-service requires JWT_SECRET

Supported variables:

#### auth-service
- PORT (default 5001)
- MONGODB_URI (default mongodb://127.0.0.1:27017/auth_db)
- JWT_SECRET (required)

#### emergency-service
- PORT (default 5002)
- MONGODB_URI (default mongodb://127.0.0.1:27017/emergency_db)
- JWT_SECRET (required for protected routes)

#### admin-service
- PORT (default 5003)
- MONGODB_URI (default mongodb://127.0.0.1:27017/admin_db)
- AUTH_SERVICE_URL (default http://127.0.0.1:5001)
- EMERGENCY_SERVICE_URL (default http://127.0.0.1:5002)
- JWT_SECRET (required for protected routes)

#### api-gateway
- PORT (default 5000)
- AUTH_SERVICE_URL (default http://127.0.0.1:5001)
- EMERGENCY_SERVICE_URL (default http://127.0.0.1:5002)
- ADMIN_SERVICE_URL (default http://127.0.0.1:5003)

### 3. Start backend services

```bash
cd backend/auth-service
npm run dev
```

```bash
cd backend/emergency-service
npm run dev
```

```bash
cd backend/admin-service
npm run dev
```

```bash
cd backend/api-gateway
npm run dev
```

### 4. Start frontend

```bash
cd frontend
npm run dev
```

Frontend URL: http://localhost:5173

## API Documentation

All client requests should go through API Gateway:
- Base URL: http://localhost:5000/api

### Health

#### GET /health
Returns gateway status and service URLs.

### Auth Routes

#### POST /api/auth/register
Create a new account.

Request body:

```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

#### POST /api/auth/login
Authenticate user and return JWT.

Request body:

```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

Response:

```json
{
    "token": "jwt-token",
    "user": {
        "email": "user@example.com",
        "role": "user"
    }
}
```

#### GET /api/auth/all-users
Returns all users (used internally by admin service).

### Emergency Routes

All emergency routes require Authorization header:

```text
Authorization: Bearer <token>
```

#### POST /api/emergencies/create
Create emergency request.

Request body:

```json
{
    "type": "Medical Emergency",
    "location": "Block A, Room 203",
    "description": "Student unconscious"
}
```

#### GET /api/emergencies/list
Get all requests sorted by latest timestamp.

#### PATCH /api/emergencies/update/:id
Admin only. Update status.

Request body:

```json
{
    "status": "in-progress"
}
```

Allowed status values:
- pending
- in-progress
- completed

#### GET /api/emergencies/stats
Admin only. Returns:

```json
{
    "total": 20,
    "pending": 8,
    "inProgress": 7,
    "completed": 5
}
```

### Admin Routes

All admin routes require:
- Valid JWT
- user.role equals admin

#### GET /api/admin/users
Fetches all users from auth service.

#### GET /api/admin/stats
Fetches global emergency stats from emergency service.

## User Roles and Access Control

- user
    - Register and login
    - Create emergency requests
    - View request list

- admin
    - All user permissions
    - Update emergency status
    - Access admin users and statistics endpoints

## Frontend Routes

- /login
- /register
- /dashboard
- /emergency/new
- /admin (admin users only)

## Troubleshooting

1. Auth service exits on startup
- Cause: JWT_SECRET is missing
- Fix: Add JWT_SECRET in auth-service .env

2. 401 Access token required
- Cause: Missing Authorization header
- Fix: Send Bearer token from login response

3. 403 Invalid or expired token
- Cause: Invalid token or JWT secret mismatch
- Fix: Re-login and ensure all services share correct JWT_SECRET

4. 403 Admin access required
- Cause: Logged in as non-admin user
- Fix: Login using account with role set to admin

5. Gateway returns service unavailable
- Cause: Downstream service not running
- Fix: Verify all backend services are running on expected ports

## Future Improvements

- Automatic assignment of nearest emergency resource
- Real-time notification channels
- Audit logs for admin actions
- Request filtering and search
- Unit and integration test coverage

