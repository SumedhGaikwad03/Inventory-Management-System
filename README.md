# Inventory Management System

A full-stack Inventory Management System built with **ASP.NET Core Web API**, **Entity Framework Core**, **Microsoft SQL Server**, **React**, and **TypeScript**.

The application streamlines warehouse and retail stock operations, product catalog management, category organization, inventory adjustments with deficit prevention, and immutable transaction audit logging. It enforces Role-Based Access Control (RBAC) with distinct workflows for administrators and standard users.

---

## Overview

The Inventory Management System provides a centralized solution for tracking products, monitoring stock levels in real time, and maintaining an auditable transaction ledger.

- **Problem Solved**: Eliminates manual stock tracking errors, prevents negative inventory states, ensures category referential integrity, and maintains an unalterable audit trail of all inventory movements linked to authenticated users.
- **Implementation**: Built as a decoupled architecture featuring a RESTful ASP.NET Core Web API backend connected to Microsoft SQL Server via Entity Framework Core, paired with a modern React + TypeScript single-page application.
- **Core Capabilities**: Role-based access control, paginated product catalog with dynamic search and sorting, category management with unique constraints, five stock transaction operations, and dashboard analytics.

---

## Documentation & Demo

- [API Documentation](https://sumedhgaikwad03.github.io/Inventory-Management-System/api)
- [ER Diagram](docs/database-schema.svg)
- [▶ Demo Video](https://youtu.be/yo4oo52Hr6Q)

---

## Features

- **Authentication & Session Management**: Secure JWT-based authentication with PBKDF2 password hashing (salt + hash verification) and automatic session recovery on page refresh.
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Full read and write permissions across product and category catalogs, stock adjustment creation, and transaction history inspection.
  - **User**: Read-only access to browse products, view categories, and monitor dashboard summary cards.
- **Product Catalog Management**: Create, read, update, and delete products with server-side pagination, instant substring search, multi-column sorting (`name`, `price`, `quantity`), category filtering, and low-stock filter toggling ($\le 5$ units).
- **Category Organization**: Group products by category with uniqueness enforcement and referential delete protection against removing categories with active products.
- **Inventory Stock Adjustments**: Execute stock modifications across five supported transaction types (`Restock`, `Return`, `Sale`, `Damage`, `Adjustment`) with negative stock deficit prevention.
- **Immutable Transaction Audit Ledger**: Detailed audit history recording product ID, quantity delta, transaction type, timestamp (UTC), and the authenticated user ID extracted from JWT claims.
- **Dashboard Overview**: Client-side aggregated inventory metrics displaying total products, total stock units, low-stock alerts, and recent transaction history.
- **Standardized Error Handling**: RFC 7807 `ProblemDetails` compliant error responses across all endpoints with field-level validation and business rule violation messages.

---

## Technology Stack

### Backend
- **Framework**: ASP.NET Core Web API (.NET 10.0)
- **Data Access / ORM**: Entity Framework Core 10.0.12
- **Database**: Microsoft SQL Server
- **Authentication**: JWT Bearer (`Microsoft.AspNetCore.Authentication.JwtBearer` 10.0.12)
- **API Documentation**: ASP.NET Core OpenAPI (`Microsoft.AspNetCore.OpenApi` 10.0.12)

### Frontend
- **UI Library**: React 18.3.1
- **Language**: TypeScript 5.7.2
- **Build Tool / Bundler**: Vite 6.0.3
- **Routing**: React Router DOM 7.18.3
- **HTTP Client**: Axios 1.7.9
- **Styling**: Custom CSS with responsive layouts (zero external UI component libraries)

---

## Architecture / Project Structure

The project is structured with a clear separation of concerns between HTTP transport, business logic, data access, and the frontend client:

```text
InventoryApi/
├── Controllers/         # API controllers handling HTTP routing, model binding, and status codes
├── DTOs/                # Data Transfer Objects enforcing input validation and response contracts
├── Data/                # EF Core DbContext, Fluent API configurations, and database seeder
├── Exceptions/          # Global exception middleware producing RFC 7807 ProblemDetails
├── Migrations/          # EF Core database schema migrations and model snapshot
├── Models/              # Domain entities (User, Category, Product, InventoryTransaction)
├── Services/            # Business logic layer (Auth, Categories, Products, Transactions)
├── Program.cs           # Dependency injection container, middleware pipeline, and CORS setup
├── appsettings.json     # Connection strings and JWT token parameters
├── docs/                # GitHub Pages documentation source (landing page, API docs, ER diagram)
└── frontend/            # React + TypeScript single-page application
    ├── src/
    │   ├── api/         # Axios transport client, API endpoints, and error parsing
    │   ├── components/  # Shared layout (Navbar, Sidebar), modal dialogs, and UI feedback
    │   ├── context/     # AuthContext managing token lifecycle and 401 session expiry
    │   ├── features/    # Feature modules (auth, categories, dashboard, products, transactions)
    │   ├── pages/       # Route fallback pages (NotFoundPage, UnauthorizedPage)
    │   ├── routes/      # Route guards (PublicRoute, ProtectedRoute, RoleRoute)
    │   ├── types/       # TypeScript interfaces aligned with backend DTOs
    │   └── utils/       # LocalStorage wrapper and JWT claim parser
    ├── package.json     # Frontend dependencies and npm scripts
    └── vite.config.ts   # Vite development server configuration (port 5173)
```

---

## Database Overview

The relational database is configured in `Data/InventoryDbContext.cs` and managed via EF Core migrations across four normalized tables:

### Tables & Entities

- **Users**: Manages user credentials, PBKDF2 password hashes, email addresses, and assigned system roles (`Admin` or `User`).
- **Categories**: Defines product groupings with unique names limited to 100 characters (`nvarchar(100)`) and optional descriptions up to 1000 characters (`nvarchar(1000)`).
- **Products**: Stores catalog items with names limited to 100 characters (`nvarchar(100)`), unit pricing with `decimal(18,2)` precision, stock quantities, and assigned category foreign keys.
- **InventoryTransactions**: Logs stock adjustments with bounded operation types (`nvarchar(20)`), quantity deltas, UTC creation timestamps, and foreign keys referencing the affected product and acting user.

### Relationships & Delete Behaviors

- **Category → Product (1 : N)**: `DeleteBehavior.Restrict`
  *A category cannot be deleted while active products remain assigned to it.*
- **Product → InventoryTransaction (1 : N)**: `DeleteBehavior.Cascade`
  *Deleting a product cascades to remove its associated transaction history.*
- **User → InventoryTransaction (1 : N)**: `DeleteBehavior.Restrict`
  *Deleting a user account preserves existing historical audit records.*

---

## Validation & Data Integrity

- **Name Length Limits**: `Category.Name` and `Product.Name` are restricted to a maximum of 100 characters in request DTOs (`[StringLength(100)]`) and database columns (`nvarchar(100)`).
- **Category Description Limit**: `Category.Description` is limited to a maximum of 1000 characters (`nvarchar(1000)`).
- **Category Name Uniqueness**: Category names must be unique across the catalog, enforced by service validation and a unique database index (`IX_Categories_Name`).
- **Transaction Type Validation**: `TransactionType` is limited to a maximum of 20 characters (`nvarchar(20)`) and restricted to valid operations: `Restock`, `Return`, `Sale`, `Damage`, and `Adjustment`.
- **Price Precision**: Product prices require non-negative decimal values configured with `decimal(18,2)` precision.
- **Deficit Prevention**: Stock reductions that would result in negative inventory are rejected with `400 Bad Request`.
- **Audit Authenticity**: The acting user ID for stock transactions is extracted directly from verified JWT claims to prevent audit identity tampering.

---

## Setup & Installation

### Prerequisites

Ensure the following dependencies are installed on your machine:
- [.NET 10.0 SDK](https://dotnet.microsoft.com/download)
- [Node.js (v18+ or v20+)](https://nodejs.org/) and `npm`
- [Microsoft SQL Server](https://www.microsoft.com/sql-server) (Local SQL Server instance or SQL Server Express)
- .NET EF Core CLI Tool (install globally if needed):
  ```bash
  dotnet tool install --global dotnet-ef
  ```

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/SumedhGaikwad03/Inventory-Management-System.git
cd Inventory-Management-System
```

---

### Step 2: Configure SQL Server

Open `appsettings.json` in the project root and verify the database connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=InventoryDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

*Note: If using SQL Server Express, adjust the `Server` property to `Server=localhost\\SQLEXPRESS;` or your designated instance name.*

---

### Step 3: Apply Database Migrations

Apply the existing EF Core migrations to create and update the SQL Server database schema:

```bash
dotnet ef database update
```

---

## Running the Application

### 1. Start the Backend API

From the root project directory:

```bash
dotnet run
```

- Backend API listens on: `http://localhost:5062`
- API Root Base: `http://localhost:5062/api`
- OpenAPI Specification: `http://localhost:5062/openapi/v1.json`
- Default test accounts are automatically seeded on initial startup if not already present.

---

### 2. Start the Frontend Application

Open a second terminal window, navigate to the `frontend` folder, install dependencies, and launch the Vite development server:

```bash
cd frontend
npm install
npm run dev
```

- Frontend application listens on: `http://localhost:5173`
- Open `http://localhost:5173` in your browser to access the application.

---

## Test Accounts

The database seeder (`Data/DbSeeder.cs`) provisions the following default test accounts:

| Role | Username | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `AdminPassword123!` | Full permissions: create, edit, delete products/categories, execute stock adjustments, view all transaction logs. |
| **Standard User** | `user` | `UserPassword123!` | Read-only permissions: browse products, view categories, and view dashboard summary cards. |

*Standard users can also register a new account via the **Sign Up** page at `http://localhost:5173/signup`.*

---

## Notes

- CORS is pre-configured in `Program.cs` to allow requests originating from `http://localhost:5173`.
- JWT authentication uses a 60-minute token expiration with zero clock skew.
