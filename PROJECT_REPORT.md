# Emergency Resource Locator and Response System

## CONTENTS

1. INTRODUCTION
   1. Overview of the Project
   2. Problem Definition
   3. Objectives of the Project
   4. Scope and Applications
2. LITERATURE REVIEW
   1. Existing Systems
   2. Proposed System
3. SYSTEM ANALYSIS AND DESIGN
   1. System Architecture
   2. Hardware Requirements
   3. Software Requirements
4. METHODOLOGY
   1. Working Principle
   2. Algorithm / Process Flow
   3. Module Description
   4. Error Handling and Validation
5. EXECUTION
   1. Execution Steps
   2. Compilation and Execution Commands
6. RESULTS
7. CONCLUSION AND FUTURE SCOPE
   1. Conclusion
   2. Future Enhancements
8. REFERENCES

---

## Chapter 1: INTRODUCTION

### 1.1 Overview of the Project

The Emergency Resource Locator and Response System is a MERN-based microservices application designed to collect emergency reports, authenticate users, and enable administrators to monitor and resolve incidents. The system contains independent backend services for authentication, emergency request lifecycle management, and administration, exposed through an API Gateway and consumed by a React frontend.

The implementation emphasizes modularity and separation of concerns:

- API Gateway routes all client traffic to internal services.
- Auth Service manages user identity and JWT-based sessions.
- Emergency Service handles report creation, listing, status updates, and statistics.
- Admin Service aggregates administrative insights by communicating with Auth and Emergency services.
- Frontend provides role-aware interfaces for users and administrators.

### 1.2 Problem Definition

Many institutions still rely on fragmented and manual incident-reporting channels such as calls, emails, and in-person reporting. These approaches create delays in response, weak visibility of pending cases, and limited traceability for decision-making.

The key problems addressed are:

- Lack of a centralized emergency intake channel.
- Delayed communication between reporting users and response teams.
- Absence of real-time tracking for incident status.
- No consolidated admin dashboard for user and incident oversight.

### 1.3 Objectives of the Project

The project objectives are:

- Provide secure registration and login with role-based authorization.
- Allow users to submit emergency reports with location and descriptive context.
- Provide transparent status lifecycle: pending, in-progress, completed.
- Enable administrators to view platform-wide statistics and manage response progress.
- Maintain a scalable architecture through independently deployable services.

### 1.4 Scope and Applications

Current scope includes:

- Emergency incident reporting and response tracking.
- Admin-side monitoring and action handling.
- Basic analytical snapshot through status counters.

Potential application environments:

- Colleges and universities.
- Hospitals and large facilities.
- Residential communities and apartment blocks.
- Corporate offices and industrial premises.

---

## Chapter 2: LITERATURE REVIEW

### 2.1 Existing Systems

Traditional and semi-digital emergency reporting systems typically suffer from one or more of the following:

- Monolithic design where authentication, reporting, and admin logic are tightly coupled.
- Limited role separation and weak security boundaries.
- Minimal incident state management beyond simple logging.
- Reduced maintainability and difficult scaling under increased load.

Some web-based portals exist, but many are optimized for ticketing rather than urgent workflows, and they generally lack service-level decoupling for independent upgrades.

### 2.2 Proposed System

The proposed system advances existing approaches by introducing:

- Microservices architecture with service-level ownership.
- JWT-based authentication with middleware authorization.
- Gateway-based request orchestration and endpoint abstraction.
- Role-specific interfaces in the frontend.
- Status-driven emergency workflow and aggregate reporting for admins.

Compared with a monolithic design, this approach improves maintainability, fault isolation, and flexibility for future growth.

---

## Chapter 3: SYSTEM ANALYSIS AND DESIGN

### 3.1 System Architecture

The implemented architecture follows client-gateway-service layering.

1. React frontend sends all API calls to a single base endpoint at the API Gateway.
2. Gateway proxies `/api/auth/*`, `/api/emergencies/*`, and `/api/admin/*` to specialized internal services.
3. Services use MongoDB databases (separate logical databases for auth, emergency, admin contexts).
4. Shared authentication middleware validates JWT and role claims before protected operations.

High-level flow:

- Login/Register requests -> Gateway -> Auth Service.
- Emergency create/list/update requests -> Gateway -> Emergency Service.
- Admin users/stats requests -> Gateway -> Admin Service -> downstream service calls.

### 3.2 Hardware Requirements

Minimum recommended environment for local development:

- CPU: Dual-core processor.
- RAM: 8 GB (16 GB preferred if running all services and frontend simultaneously).
- Storage: 2 GB free for dependencies and logs.
- Network: Localhost connectivity among services and database.

For containerized execution:

- Docker Desktop with adequate memory allocation (at least 4 GB for smooth parallel service startup).

### 3.3 Software Requirements

Primary software stack:

- Node.js runtime (current LTS recommended).
- npm package manager.
- MongoDB (local installation or Docker Mongo image).
- React + TypeScript frontend (Vite + Tailwind CSS).
- Express.js for backend APIs.
- Mongoose ODM for MongoDB modeling.
- JWT for authentication tokens.
- bcryptjs for password hashing.
- Axios/fetch for inter-service and client-server HTTP communication.

---

## Chapter 4: METHODOLOGY

### 4.1 Working Principle

The system uses token-based access control and role-based route protection.

Operational sequence:

1. User registers through Auth Service (`/auth/register`).
2. User logs in (`/auth/login`) and receives JWT containing identity and role.
3. Frontend stores token and attaches `Authorization: Bearer <token>` to protected requests.
4. Emergency Service validates token and allows report creation/listing.
5. Admin-only actions (status updates, user listing, stats) require role `admin`.
6. Updated incident states become visible to users and administrators.

### 4.2 Algorithm / Process Flow

#### A. Authentication Flow

1. Input: email and password.
2. Validate non-empty credentials.
3. Retrieve user by email.
4. Compare password hash using bcrypt.
5. If valid, issue JWT with expiry (`1d`) and role claim.
6. Return token and user profile summary.

#### B. Emergency Submission Flow

1. Input: type, location, optional description.
2. Validate required fields.
3. Verify JWT.
4. Persist new emergency request with default status `pending`.
5. Return created object and refresh dashboard listing.

#### C. Admin Status Update Flow

1. Admin fetches pending/in-progress requests.
2. Selects action: `pending -> in-progress` or `in-progress -> completed`.
3. Sends PATCH request with updated status.
4. Service writes changes and returns updated request.
5. Dashboard reflects latest lifecycle state.

### 4.3 Module Description

#### Module 1: API Gateway

- File basis: backend/api-gateway/index.js.
- Exposes unified routes for auth, emergency, and admin APIs.
- Forwards HTTP method, body, and authorization header.
- Includes health endpoint (`/health`) for service visibility.

#### Module 2: Auth Service

- Files: backend/auth-service/index.js, routes/auth.js, models/User.js.
- Handles user registration and duplicate email checks.
- Hashes passwords via pre-save mongoose hook.
- Generates JWT with role claims.
- Provides all-users endpoint consumed by admin workflows.

#### Module 3: Emergency Service

- Files: backend/emergency-service/index.js, routes/emergency.js, models/EmergencyRequest.js.
- Creates and lists emergency requests.
- Supports status update endpoint restricted to admin role.
- Provides status summary counts for analytics.

#### Module 4: Admin Service

- Files: backend/admin-service/index.js, routes/admin.js.
- Validates admin role before administrative APIs.
- Fetches users from Auth Service.
- Fetches global request stats from Emergency Service.
- Aggregates operational data for admin interface.

#### Module 5: Shared Middleware

- File: backend/middleware/auth.js.
- Verifies JWT authenticity and expiry.
- Injects decoded user payload into request context.
- Provides role guard (`requireRole`) for sensitive routes.

#### Module 6: Frontend Application

- Core file: frontend/src/App.tsx.
- Routing and authentication state management.
- Token persistence in local storage.
- API calls through centralized base URL.

Key UI components:

- LoginPage.tsx: credential submission and sign-in UX.
- RegisterPage.tsx: account creation with confirm-password checks.
- Dashboard.tsx: user dashboard with emergency listing and status badges.
- EmergencyForm.tsx: structured emergency report submission.
- AdminDashboard.tsx: admin stats, user list, and response-action controls.

### 4.4 Error Handling and Validation

Implemented validation and handling patterns include:

- Required-field checks during registration and emergency creation.
- Duplicate account protection at registration.
- Unauthorized and forbidden responses for missing/invalid tokens and roles.
- Gateway-level service unavailability fallback (`502` with readable error).
- Frontend-side graceful fallback for failed fetches and unexpected payloads.

Observed limitations and risks from analysis:

- Frontend hardcodes API URL to localhost, reducing environment portability.
- Dashboard table header repeats “Reported” column label once unnecessarily.
- Admin dashboard includes a delete icon UI action without backend delete endpoint.
- No automated tests currently included for regression safety.

---

## Chapter 5: EXECUTION

### 5.1 Execution Steps

#### Local (recommended for development)

1. Start MongoDB service locally on default port 27017.
2. Install dependencies in each service and frontend directory.
3. Configure environment variables (`MONGODB_URI`, `JWT_SECRET`, and service URLs where required).
4. Start backend services in separate terminals:
   - Auth Service (5001)
   - Emergency Service (5002)
   - Admin Service (5003)
   - API Gateway (5000)
5. Start frontend (Vite default: 5173).
6. Access frontend in browser, register/login, submit emergency reports, and verify admin controls.

#### Docker-based execution

1. Ensure Docker engine is running.
2. Run compose build and startup.
3. Verify containers for mongo, services, gateway, and frontend are healthy.

### 5.2 Compilation and Execution Commands

#### Backend installation (run per service)

```bash
cd backend/auth-service
npm install
npm run dev
```

```bash
cd backend/emergency-service
npm install
npm run dev
```

```bash
cd backend/admin-service
npm install
npm run dev
```

```bash
cd backend/api-gateway
npm install
npm run dev
```

#### Frontend installation and execution

```bash
cd frontend
npm install
npm run dev
```

#### Frontend build and checks

```bash
npm run build
npm run lint
npm run typecheck
```

#### Docker Compose commands

```bash
docker-compose up --build
```

```bash
docker-compose down
```

---

## Chapter 6: RESULTS

Based on the implemented code and integration flow, the system achieves the following results:

- Successful role-based authentication and authorization model.
- End-to-end emergency reporting lifecycle from submission to resolution.
- Distinct user and admin dashboards tailored to responsibilities.
- Aggregated admin statistics for operational visibility.
- Service-oriented backend supporting modular maintenance and extension.

Functional result summary:

- User Journey: register -> login -> create emergency -> monitor status.
- Admin Journey: login as admin -> review requests -> update statuses -> monitor platform stats and users.

---

## Chapter 7: CONCLUSION AND FUTURE SCOPE

### 7.1 Conclusion

The project successfully demonstrates a practical microservices-based emergency response platform. It provides secure account management, real-time status-driven workflows, and administrative oversight within a modular architecture that can be deployed locally or through containers.

The design decisions improve maintainability and make the system suitable for medium-scale institutional use while preserving a straightforward user experience.

### 7.2 Future Enhancements

Potential upgrades for production readiness and richer operations include:

- Add incident assignment workflow (responder/team ownership).
- Integrate real-time notifications (WebSockets, email, SMS).
- Add geolocation and map-based incident visualization.
- Introduce audit logging and detailed action history.
- Implement user-management actions (promote role, disable account, delete user).
- Replace hardcoded API endpoints with environment-based frontend configuration.
- Add unit/integration/end-to-end tests and CI pipeline.
- Add observability stack (metrics, tracing, centralized logs).

---

## Chapter 8: REFERENCES

1. Node.js Documentation. https://nodejs.org/
2. Express.js Documentation. https://expressjs.com/
3. MongoDB Documentation. https://www.mongodb.com/docs/
4. Mongoose Documentation. https://mongoosejs.com/docs/
5. React Documentation. https://react.dev/
6. Vite Documentation. https://vitejs.dev/
7. JWT Introduction. https://jwt.io/introduction
8. Tailwind CSS Documentation. https://tailwindcss.com/docs

---

## LIST OF FIGURES (Suggested)

- Figure 3.1: Overall Microservices Architecture (Frontend -> API Gateway -> Services -> MongoDB)
- Figure 4.1: User Authentication Sequence Flow
- Figure 4.2: Emergency Report Submission Flow
- Figure 4.3: Admin Status Update Workflow
- Figure 6.1: User Dashboard with Emergency Status Table
- Figure 6.2: Admin Dashboard with Stats and Action Controls
