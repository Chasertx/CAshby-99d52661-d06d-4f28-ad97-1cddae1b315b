# Task Management System

This is a multi-tenant task management platform built as an Nx monorepo. It utilizes a NestJS backend and an Angular frontend, with shared libraries to ensure a consistent data layer across the stack. The primary architectural focus is strict organization-based data isolation.

## Technical Overview

The project is designed to handle multiple organizations (tenants) within a single data store. Security is enforced by scoping every request to an organizationId tied to the user session.

* Frontend: Angular (Standalone components, Signals for state management, RxJS).
* Backend: NestJS with TypeORM and SQLite.
* Tooling: Nx for workspace management and build orchestration.
* Authentication: JWT-based auth with Role-Based Access Control (RBAC).

---


## Quick Start with Docker

The environment is containerized using Docker Compose, which handles the API, Frontend.

1. Clone the repository:
   git clone https://github.com/Chasertx/CAshby-99d52661-d06d-4f28-ad97-1cddae1b315b.git

2. Launch the stack:
   docker-compose up --build

The Dashboard is served at http://localhost:80 and the API is accessible at http://localhost:3000/api.

---
## User Instruction

### 1. Account Creation
To begin using the application, follow these steps:
1. Navigate to the login page and click **"Create new account"**.
2. Fill in the required information (any valid email format will work).
3. Click **Submit**. You will be automatically authenticated and redirected to the dashboard.

### 2. Role Management
The application features a dynamic role-switching mechanism for development and testing. In the top-left corner of the header, you can change your active role to test different permission levels.

### 3. Roles and Capabilities
| Role | Capabilities |
| :--- | :--- |
| **Viewer** | Can view the board and existing tasks. |
| **Admin** | Can view, move, and create tasks. |
| **Owner** | Full access: View, move, create, and delete tasks. |

### Try for yourself!
---

## Organization Scoping (in development)

Data isolation is enforced at the service layer. We utilize a "Hard Scoping" strategy where the organizationId is extracted directly from the verified JWT rather than trusting client-side input.

1. The backend extracts the organizationId from the JwtStrategy.
2. The TasksService includes this ID in the "where" clause of every TypeORM query.
3. This prevents cross-tenant data leakage and ensures users can only access resources belonging to their specific workspace.

---

## Local Development Setup

To run the services natively, you will need Node.js (v18+). Since the project uses SQLite, no external database installation is required.

1. Install dependencies:
   npm install

2. Configure environment:
   Create a .env file in the root directory:
   JWT_SECRET=your_development_secret

3. Start the applications:
   # Backend
   nx serve api

   # Frontend
   nx serve dashboard

---

## Workspace Management

We use the Nx CLI for common development tasks.

* Visualize dependency graph: nx graph
* Production build: nx build dashboard --prod