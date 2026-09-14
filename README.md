# Inventory Management System

A full-stack Inventory Management System built with **ASP.NET Core Web API**, **Entity Framework Core**, **Microsoft SQL Server**, **React**, and **TypeScript**.

The application manages product cataloging, category organization, inventory stock adjustments, historical transaction tracking, and role-based access control. It provides an administrative interface for inventory operators alongside a restricted view for standard users.

---

## API Documentation

Comprehensive endpoint specifications, request/response schemas, authentication requirements, and role permissions are available in the dedicated documentation file:

- **[View API Documentation](docs/api.md)**

---

## Features

- **Authentication**: Secure JWT-based authentication with salted PBKDF2 password hashing and automatic session restoration on reload.
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Full read and write access across all entities, product and category CRUD, stock adjustments, and transaction history.
  - **User**: Read-only access to browse the Dashboard, Product catalog, and Category list.
- **Product Management**: Create, read, update, and delete products with server-side pagination, search-as-you-type, multi-column sorting, category filtering, and low-stock filter toggling.
- **Category Management**: Create, edit, and delete product categories with referential integrity checks preventing the deletion of categories that have assigned products.
- **Inventory Stock Adjustments**: Record stock level changes supporting `Restock`, `Sale`, `Damage`, and `Return` operations with stock deficit prevention (blocks negative inventory).
- **Transaction History**: Historical ledger logging stock changes, operation types, timestamps, associated products, and the user who initiated the action.
- **Dashboard**: High-level inventory overview showing total products, total stock units, low-stock item counts, and recent transaction records.
- **Validation & Error Handling**: Client-side form validation, DTO DataAnnotations, service-level rule enforcement, and standardized RFC 7807 `ProblemDetails` error responses with user-friendly alerts.

---

## Tech Stack

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
- **Styling**: Custom CSS with responsive layouts (no external UI component libraries)

---

## Project Structure

```text
InventoryApi/
├── Controllers/         # API controllers handling HTTP requests and routing
├── DTOs/                # Data Transfer Objects for request validation and response mapping
├── Data/                # EF Core DbContext and database seed definitions
├── Exceptions/          # Global exception handler producing RFC 7807 ProblemDetails
├── Migrations/          # EF Core database schema migrations
├── Models/              # Domain database entities (User, Category, Product, InventoryTransaction)
├── Services/            # Business logic layer (Auth, Categories, Products, Transactions)
├── Program.cs           # Dependency injection, middleware pipeline, and app configuration
├── appsettings.json     # Connection strings and JWT settings
└── frontend/            # React + TypeScript single-page application
    ├── src/
    │   ├── api/         # Axios transport client, endpoint definitions, and error parser
    │   ├── components/  # Shared UI, layout (Navbar, Sidebar), and feedback components
    │   ├── context/     # AuthContext managing user sessions and 401 state invalidation
    │   ├── features/    # Feature modules (auth, categories, dashboard, products, transactions)
    │   ├── pages/       # Route fallback pages (NotFoundPage, UnauthorizedPage)
    │   ├── routes/      # Route declarations with PublicRoute, ProtectedRoute, and RoleRoute guards
    │   ├── types/       # TypeScript interfaces matching backend DTO contracts
    │   └── utils/       # Local storage wrapper and JWT token decoder
    ├── package.json     # Frontend dependencies and npm scripts
    └── vite.config.ts   # Vite server configuration (port 5173)
```

---

## Setup & Running

The application is designed to run locally. Follow the steps below to configure, migrate, and start both the backend and frontend.

### Prerequisites

Ensure the following tools are installed on your machine:
- [.NET 10.0 SDK](https://dotnet.microsoft.com/download)
- [Node.js (v18+ or v20+)](https://nodejs.org/) and `npm`
- [Microsoft SQL Server](https://www.microsoft.com/sql-server) (Local SQL Server instance or SQL Server Express)
- .NET EF Core CLI Tool (install globally if not already available):
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

Open `appsettings.json` in the project root and verify the connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=InventoryDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

- If using a default local SQL Server instance, the default connection string works as configured.
- If using SQL Server Express, update the `Server` property to `Server=localhost\\SQLEXPRESS;` or your specific instance name.

---

### Step 3: Apply EF Core Migrations

Before launching the application, create the database schema by applying the existing EF Core migrations:

```bash
dotnet ef database update
```

---

### Step 4: Run the Backend API

Start the ASP.NET Core Web API:

```bash
dotnet run
```

- The backend will build and start listening on `http://localhost:5062`.
- On startup, the database seeder (`DbSeeder.cs`) checks for and creates default test accounts if they do not already exist.
- Keep this terminal window open.

---

### Step 5: Run the Frontend

Open a **second terminal window**, navigate to the `frontend` folder, install npm dependencies, and start the Vite development server:

```bash
cd frontend
npm install
npm run dev
```

- The frontend will compile and start listening on `http://localhost:5173`.
- Open `http://localhost:5173` in your browser to use the application.

> **Note**: The backend must remain running in the first terminal for the frontend to authenticate and load inventory data.

---

## Application URLs

| Service | URL | Description |
| :--- | :--- | :--- |
| **Frontend Application** | `http://localhost:5173` | React single-page application |
| **Backend API Base** | `http://localhost:5062/api` | ASP.NET Core REST API root |
| **OpenAPI Specification** | `http://localhost:5062/openapi/v1.json` | OpenAPI v1 JSON endpoint |

*(Note: Swagger UI is not configured; endpoint contracts are served via the OpenAPI JSON endpoint).*

---

## Test Accounts

The database seeder (`Data/DbSeeder.cs`) automatically seeds two test accounts upon startup:

| Role | Username | Password | Access & Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `AdminPassword123!` | Full permissions: create/edit/delete products and categories, execute stock adjustments, view all transaction logs. |
| **Standard User** | `user` | `UserPassword123!` | Read-only permissions: browse products, view categories, and view dashboard summary cards. Blocked from write operations. |

Standard users can also register new accounts directly through the **Sign Up** page at `http://localhost:5173/signup`.

---

## Database

The database is normalized across four primary entities configured in `Data/InventoryDbContext.cs`:

- **Users**: Stores credentials (salted PBKDF2 hash), email, and system roles (`Admin` vs `User`).
- **Categories**: Defines product categories with unique name constraints, a maximum name length of 100 characters (`nvarchar(100)`), and optional description up to 1000 characters (`nvarchar(1000)`).
- **Products**: Contains item stock records, maximum name length of 100 characters (`nvarchar(100)`), pricing (`decimal(18,2)`), and category foreign keys.
- **InventoryTransactions**: Logs inventory stock changes with bounded transaction type (`nvarchar(20)`: `Restock`, `Sale`, `Damage`, `Return`, `Adjustment`), quantity delta, timestamp, and user reference.

### Foreign Key & Delete Behaviors
- **Category → Product**: `DeleteBehavior.Restrict` (A category cannot be deleted while products are assigned to it).
- **Product → InventoryTransaction**: `DeleteBehavior.Cascade` (Deleting a product removes its associated historical transaction records).
- **User → InventoryTransaction**: `DeleteBehavior.Restrict` (Deleting a user account preserves existing transaction history records).

The complete Entity-Relationship Diagram and detailed schema documentation are provided in the external technical documentation.

---

## Additional Documentation

Detailed technical documentation, API specifications, and visual demonstrations are maintained in the following resources:

- **Technical Documentation & API Reference**: [GOOGLE_DOC_LINK](GOOGLE_DOC_LINK)  
  *Contains full API endpoint tables, request/response JSON payloads, architecture explanations, and error code mappings.*
- **Database Design & ER Diagram**: [GOOGLE_DOC_LINK](GOOGLE_DOC_LINK)  
  *Contains the detailed visual ER diagram and database schema reference.*
- **Application Demonstration Video**: [YOUTUBE_DEMO_LINK](YOUTUBE_DEMO_LINK)  
  *An unlisted video walkthrough showcasing authentication, RBAC restrictions, category/product management, and stock adjustments.*

---

## Notes

- This repository is configured for local development and does not require cloud deployment.
- CORS is pre-configured in `Program.cs` to allow requests originating from `http://localhost:5173`.
