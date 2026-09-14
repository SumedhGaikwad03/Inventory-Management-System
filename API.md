# Inventory Management System API

The Inventory Management System API is a RESTful service built with ASP.NET Core and Microsoft SQL Server. It powers the backend for user authentication, product catalog management, category organization, stock level adjustments, and inventory transaction auditing.

The API implements JSON Web Token (JWT) authentication and enforces Role-Based Access Control (RBAC) across standard **User** and **Admin** roles.

---

## Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
  - [Permissions](#permissions)
- [Endpoint Summary](#endpoint-summary)
  - [Authentication](#authentication-summary)
  - [Products](#products-summary)
  - [Categories](#categories-summary)
  - [Inventory Transactions](#inventory-transactions-summary)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication-endpoints)
    - [POST /api/auth/signup](#post-apiauthsignup)
    - [POST /api/auth/login](#post-apiauthlogin)
  - [Products](#products-endpoints)
    - [GET /api/products](#get-apiproducts)
    - [GET /api/products/{id}](#get-apiproductsid)
    - [POST /api/products](#post-apiproducts)
    - [PUT /api/products/{id}](#put-apiproductsid)
    - [DELETE /api/products/{id}](#delete-apiproductsid)
  - [Categories](#categories-endpoints)
    - [GET /api/categories](#get-apicategories)
    - [GET /api/categories/{id}](#get-apicategoriesid)
    - [POST /api/categories](#post-apicategories)
    - [PUT /api/categories/{id}](#put-apicategoriesid)
    - [DELETE /api/categories/{id}](#delete-apicategoriesid)
  - [Inventory Transactions](#inventory-transactions-endpoints)
    - [POST /api/inventorytransactions](#post-apiinventorytransactions)
    - [GET /api/inventorytransactions](#get-apiinventorytransactions)
    - [GET /api/inventorytransactions/{id}](#get-apiinventorytransactionsid)
    - [GET /api/inventorytransactions/product/{productId}](#get-apiinventorytransactionsproductproductid)
- [Error Responses](#error-responses)
- [Important Rules](#important-rules)

---

## Overview

The API manages core warehouse and inventory operations:

- **User Accounts & Auth**: Registration and credential validation returning signed JWT tokens.
- **Products Catalog**: Product item management with real-time stock levels, pricing, category references, and paginated search.
- **Categories**: Logical grouping of items with referential delete protection and uniqueness constraints.
- **Stock Adjustments**: Audited quantity updates (`Restock`, `Sale`, `Damage`, `Return`) with deficit protection against negative stock.
- **Audit Ledger**: Comprehensive historical transaction logging capturing user claims, quantity deltas, and UTC timestamps.

---

## Base URL

```text
http://localhost:5062/api
```

---

## Authentication

- Registration (`/api/auth/signup`) and login (`/api/auth/login`) are publicly accessible endpoints.
- Authenticated requests must provide a valid JWT token in the standard HTTP `Authorization` header:
  ```http
  Authorization: Bearer <your-jwt-token>
  ```
- **Token Expiration**: 60 minutes with `ClockSkew = TimeSpan.Zero`.
- **User Claims**: User identity and role attributes (`NameIdentifier`, `Name`, `Role`) are resolved directly from token claims.

### Permissions

- **User**: Read-only access to list and view products, categories, and dashboard metrics. Blocked from write operations (create, update, delete, stock adjustments).
- **Admin**: Full read and write permissions across all entities, product/category management, stock adjustments, and transaction audit logs.

---

## Endpoint Summary

### <a id="authentication-summary"></a>Authentication

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Public | Register a new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials and receive a JWT |

### <a id="products-summary"></a>Products

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/products` | User, Admin | List, search, filter, and sort products with pagination |
| `GET` | `/api/products/{id}` | User, Admin | Get full details for a single product by ID |
| `POST` | `/api/products` | Admin | Create a new product |
| `PUT` | `/api/products/{id}` | Admin | Update an existing product |
| `DELETE` | `/api/products/{id}` | Admin | Delete a product from inventory |

### <a id="categories-summary"></a>Categories

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/categories` | User, Admin | List all product categories |
| `GET` | `/api/categories/{id}` | User, Admin | Get single category details by ID |
| `POST` | `/api/categories` | Admin | Create a new category |
| `PUT` | `/api/categories/{id}` | Admin | Update an existing category name and description |
| `DELETE` | `/api/categories/{id}` | Admin | Delete a category (blocked if active products exist) |

### <a id="inventory-transactions-summary"></a>Inventory Transactions

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/inventorytransactions` | Admin | Record a stock adjustment and update product inventory |
| `GET` | `/api/inventorytransactions` | Admin | List all transaction history records (newest first) |
| `GET` | `/api/inventorytransactions/{id}` | Admin | Get transaction details by ID |
| `GET` | `/api/inventorytransactions/product/{productId}` | Admin | List transaction history for a specific product |

---

## API Endpoints

### <a id="authentication-endpoints"></a>Authentication

#### `POST /api/auth/signup`

Registers a new user account with the standard `User` role.

**Access:** Public

**Request**

```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "johndoe@example.com",
  "password": "Password123!"
}
```

**Response**

```json
{
  "id": 3,
  "username": "johndoe",
  "email": "johndoe@example.com",
  "createdDate": "2026-09-14T10:15:30Z"
}
```

**Status Codes**

- `200 OK` - User registered successfully.
- `400 Bad Request` - Username already taken or validation failure (password must be at least 8 characters, valid email required).

---

#### `POST /api/auth/login`

Authenticates user credentials and returns a signed JWT token.

**Access:** Public

**Request**

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "AdminPassword123!"
}
```

**Response (Success)**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Invalid Credentials)**

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.2",
  "title": "Unauthorized.",
  "status": 401,
  "detail": "Invalid username or password."
}
```

**Status Codes**

- `200 OK` - Login successful, JWT returned.
- `400 Bad Request` - Missing username or password.
- `401 Unauthorized` - Invalid username or password.

---

### <a id="products-endpoints"></a>Products

#### `GET /api/products`

Retrieves a paginated list of products with optional search, sorting, category, and low-stock filters.

**Access:** User, Admin

**Query Parameters**

| Parameter | Required | Default | Description |
|---|---|---|---|
| `search` | No | - | Substring to match against product name |
| `page` | No | `1` | Page number (must be >= 1) |
| `pageSize` | No | `10` | Number of items per page (1 to 100) |
| `sortBy` | No | - | Sort column: `name`, `price`, or `quantity` (defaults to ID) |
| `sortOrder` | No | `asc` | Sort direction: `asc` or `desc` |
| `lowStock` | No | `false` | When `true`, filters items where quantity <= 5 |

**Request**

```http
GET /api/products?search=desk&page=1&pageSize=10&sortBy=price&sortOrder=asc
Authorization: Bearer <your-jwt-token>
```

**Response**

```json
{
  "items": [
    {
      "id": 1,
      "name": "Standing Desk 60-Inch",
      "quantity": 8,
      "price": 349.99,
      "categoryId": 2,
      "categoryName": "Office Furniture",
      "createdDate": "2026-09-12T08:00:00Z",
      "updatedDate": "2026-09-14T09:30:00Z"
    }
  ],
  "page": 1,
  "pageSize": 10,
  "totalItems": 1,
  "totalPages": 1
}
```

**Status Codes**

- `200 OK` - Products retrieved successfully.
- `400 Bad Request` - Invalid query parameters (e.g. invalid `page` or `pageSize`).
- `401 Unauthorized` - Missing or invalid token.

---

#### `GET /api/products/{id}`

Retrieves full details for a single product by ID.

**Access:** User, Admin

**Request**

```http
GET /api/products/1
Authorization: Bearer <your-jwt-token>
```

**Response**

```json
{
  "id": 1,
  "name": "Standing Desk 60-Inch",
  "quantity": 8,
  "price": 349.99,
  "categoryId": 2,
  "categoryName": "Office Furniture",
  "createdDate": "2026-09-12T08:00:00Z",
  "updatedDate": "2026-09-14T09:30:00Z"
}
```

**Status Codes**

- `200 OK` - Product found.
- `401 Unauthorized` - Missing or invalid token.
- `404 Not Found` - Product ID does not exist.

---

#### `POST /api/products`

Creates a new product in the inventory catalog.

**Access:** Admin

**Request**

```http
POST /api/products
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Ergonomic Office Chair",
  "quantity": 25,
  "price": 199.50,
  "categoryId": 2
}
```

**Response**

```json
{
  "id": 5,
  "name": "Ergonomic Office Chair",
  "quantity": 25,
  "price": 199.50,
  "categoryId": 2,
  "categoryName": "Office Furniture",
  "createdDate": "2026-09-14T11:00:00Z",
  "updatedDate": "2026-09-14T11:00:00Z"
}
```

**Status Codes**

- `201 Created` - Product created successfully.
- `400 Bad Request` - Validation error or referenced category ID does not exist.
- `401 Unauthorized` - Missing or invalid token.
- `403 Forbidden` - User is not an Admin.

---

#### `PUT /api/products/{id}`

Updates an existing product's name, quantity, price, or category.

**Access:** Admin

**Request**

```http
PUT /api/products/5
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Ergonomic Office Chair Pro",
  "quantity": 20,
  "price": 229.00,
  "categoryId": 2
}
```

**Response**

```json
{
  "id": 5,
  "name": "Ergonomic Office Chair Pro",
  "quantity": 20,
  "price": 229.00,
  "categoryId": 2,
  "categoryName": "Office Furniture",
  "createdDate": "2026-09-14T11:00:00Z",
  "updatedDate": "2026-09-14T11:25:00Z"
}
```

**Status Codes**

- `200 OK` - Product updated successfully.
- `400 Bad Request` - Validation failure or referenced category does not exist.
- `401 Unauthorized` - Missing or invalid token.
- `403 Forbidden` - User is not an Admin.
- `404 Not Found` - Product ID not found.

---

#### `DELETE /api/products/{id}`

Deletes a product and cascades removal of associated transaction history from the database.

**Access:** Admin

**Request**

```http
DELETE /api/products/5
Authorization: Bearer <your-jwt-token>
```

**Response**

```http
HTTP/1.1 204 No Content
```

**Status Codes**

- `204 No Content` - Product deleted successfully.
- `401 Unauthorized` - Missing or invalid token.
- `403 Forbidden` - User is not an Admin.
- `404 Not Found` - Product ID not found.

---

### <a id="categories-endpoints"></a>Categories

#### `GET /api/categories`

Retrieves all product categories.

**Access:** User, Admin

**Request**

```http
GET /api/categories
Authorization: Bearer <your-jwt-token>
```

**Response**

```json
[
  {
    "id": 1,
    "name": "Electronics",
    "description": "Laptops, monitors, and cables",
    "createdDate": "2026-09-11T07:30:00Z"
  },
  {
    "id": 2,
    "name": "Office Furniture",
    "description": "Desks, chairs, and shelving",
    "createdDate": "2026-09-11T07:35:00Z"
  }
]
```

**Status Codes**

- `200 OK` - Categories retrieved successfully.
- `401 Unauthorized` - Missing or invalid token.

---

#### `GET /api/categories/{id}`

Retrieves single category details by ID.

**Access:** User, Admin

**Request**

```http
GET /api/categories/1
Authorization: Bearer <your-jwt-token>
```

**Response**

```json
{
  "id": 1,
  "name": "Electronics",
  "description": "Laptops, monitors, and cables",
  "createdDate": "2026-09-11T07:30:00Z"
}
```

**Status Codes**

- `200 OK` - Category found.
- `401 Unauthorized` - Missing or invalid token.
- `404 Not Found` - Category ID does not exist.

---

#### `POST /api/categories`

Creates a new product category.

**Access:** Admin

**Request**

```http
POST /api/categories
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Packaging Supplies",
  "description": "Boxes, tape, bubble wrap, and shipping containers"
}
```

**Response**

```json
{
  "id": 3,
  "name": "Packaging Supplies",
  "description": "Boxes, tape, bubble wrap, and shipping containers",
  "createdDate": "2026-09-14T11:45:00Z"
}
```

**Status Codes**

- `201 Created` - Category created successfully.
- `400 Bad Request` - Category name already exists or required `name` field is missing.
- `401 Unauthorized` - Missing or invalid token.
- `403 Forbidden` - User is not an Admin.

---

#### `PUT /api/categories/{id}`

Updates an existing category's name and description.

**Access:** Admin

**Request**

```http
PUT /api/categories/3
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Shipping & Packaging",
  "description": "Boxes, labels, bubble wrap, and shipping supplies"
}
```

**Response**

```json
{
  "id": 3,
  "name": "Shipping & Packaging",
  "description": "Boxes, labels, bubble wrap, and shipping supplies",
  "createdDate": "2026-09-14T11:45:00Z"
}
```

**Status Codes**

- `200 OK` - Category updated successfully.
- `400 Bad Request` - Category name conflict with another existing category.
- `401 Unauthorized` - Missing or invalid token.
- `403 Forbidden` - User is not an Admin.
- `404 Not Found` - Category ID not found.

---

#### `DELETE /api/categories/{id}`

Deletes a category from the database. Blocked if products are currently assigned to it (`DeleteBehavior.Restrict`).

**Access:** Admin

**Request**

```http
DELETE /api/categories/2
Authorization: Bearer <your-jwt-token>
```

**Response (Success)**

```http
HTTP/1.1 204 No Content
```

**Response (Failure - Category Has Active Products)**

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "Invalid request.",
  "status": 400,
  "detail": "Cannot delete a category that has products."
}
```

**Status Codes**

- `204 No Content` - Category deleted successfully.
- `400 Bad Request` - Cannot delete category because products are currently assigned to it.
- `401 Unauthorized` - Missing or invalid token.
- `403 Forbidden` - User is not an Admin.
- `404 Not Found` - Category ID not found.

---

### <a id="inventory-transactions-endpoints"></a>Inventory Transactions

#### `POST /api/inventorytransactions`

Records a stock adjustment, recalculates product inventory, and logs an immutable audit ledger entry. The acting user ID is securely resolved from the authenticated JWT claims.

**Access:** Admin

**Supported Transaction Types**

| Type | Quantity Sign | Effect | Description |
|---|---|---|---|
| `Restock` | Positive (`> 0`) | Adds stock | Incoming stock shipment from supplier |
| `Return` | Positive (`> 0`) | Adds stock | Customer returns item back to inventory |
| `Sale` | Negative (`< 0`) | Removes stock | Outgoing customer purchase |
| `Damage` | Negative (`< 0`) | Removes stock | Damaged or written-off inventory |

**Example 1: Restock Request (+10 Units)**

```http
POST /api/inventorytransactions
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "productId": 1,
  "quantityChanged": 10,
  "transactionType": "Restock"
}
```

**Response (200 OK)**

```json
{
  "id": 12,
  "productId": 1,
  "productName": "Standing Desk 60-Inch",
  "userId": 1,
  "username": "admin",
  "quantityChanged": 10,
  "transactionType": "Restock",
  "createdDate": "2026-09-14T12:00:00Z"
}
```

**Example 2: Sale Request (-3 Units)**

```http
POST /api/inventorytransactions
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "productId": 1,
  "quantityChanged": -3,
  "transactionType": "Sale"
}
```

**Response (200 OK)**

```json
{
  "id": 13,
  "productId": 1,
  "productName": "Standing Desk 60-Inch",
  "userId": 1,
  "username": "admin",
  "quantityChanged": -3,
  "transactionType": "Sale",
  "createdDate": "2026-09-14T12:05:00Z"
}
```

**Example 3: Negative Stock Error (Attempting to deduct more stock than available)**

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "Invalid request.",
  "status": 400,
  "detail": "Inventory quantity cannot be negative."
}
```

**Status Codes**

- `200 OK` - Stock level adjusted and audit transaction logged.
- `400 Bad Request` - Product not found, or quantity change would result in negative stock.
- `401 Unauthorized` - Missing or invalid token.
- `403 Forbidden` - User is not an Admin.

---

#### `GET /api/inventorytransactions`

Lists all inventory transaction records ordered from newest to oldest.

**Access:** Admin

**Request**

```http
GET /api/inventorytransactions
Authorization: Bearer <your-jwt-token>
```

**Response**

```json
[
  {
    "id": 13,
    "productId": 1,
    "productName": "Standing Desk 60-Inch",
    "userId": 1,
    "username": "admin",
    "quantityChanged": -3,
    "transactionType": "Sale",
    "createdDate": "2026-09-14T12:05:00Z"
  },
  {
    "id": 12,
    "productId": 1,
    "productName": "Standing Desk 60-Inch",
    "userId": 1,
    "username": "admin",
    "quantityChanged": 10,
    "transactionType": "Restock",
    "createdDate": "2026-09-14T12:00:00Z"
  }
]
```

**Status Codes**

- `200 OK` - Transactions retrieved.
- `401 Unauthorized` - Missing or invalid token.
- `403 Forbidden` - User is not an Admin.

---

#### `GET /api/inventorytransactions/{id}`

Retrieves details for a single transaction by ID.

**Access:** Admin

**Request**

```http
GET /api/inventorytransactions/12
Authorization: Bearer <your-jwt-token>
```

**Response**

```json
{
  "id": 12,
  "productId": 1,
  "productName": "Standing Desk 60-Inch",
  "userId": 1,
  "username": "admin",
  "quantityChanged": 10,
  "transactionType": "Restock",
  "createdDate": "2026-09-14T12:00:00Z"
}
```

**Status Codes**

- `200 OK` - Transaction found.
- `401 Unauthorized` - Missing or invalid token.
- `403 Forbidden` - User is not an Admin.
- `404 Not Found` - Transaction ID not found.

---

#### `GET /api/inventorytransactions/product/{productId}`

Lists all transaction history records for a single product.

**Access:** Admin

**Request**

```http
GET /api/inventorytransactions/product/1
Authorization: Bearer <your-jwt-token>
```

**Response**

```json
[
  {
    "id": 13,
    "productId": 1,
    "productName": "Standing Desk 60-Inch",
    "userId": 1,
    "username": "admin",
    "quantityChanged": -3,
    "transactionType": "Sale",
    "createdDate": "2026-09-14T12:05:00Z"
  }
]
```

**Status Codes**

- `200 OK` - Product transactions retrieved.
- `401 Unauthorized` - Missing or invalid token.
- `403 Forbidden` - User is not an Admin.

---

## Error Responses

The API formats all error responses according to the **RFC 7807 ProblemDetails** specification.

### 1. Business Rule Failure (`400 Bad Request`)

Returned when a business validation rule is violated:

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "Invalid request.",
  "status": 400,
  "detail": "Inventory quantity cannot be negative."
}
```

### 2. Model Validation Failure (`400 Bad Request`)

Returned when request body fields fail DataAnnotation validation attributes:

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Name": [
      "The Name field is required."
    ],
    "Price": [
      "The field Price must be between 0 and 9999999999999999.99."
    ]
  }
}
```

### Common HTTP Status Codes

| Status | Meaning | Description |
|---|---|---|
| `200 OK` | Success | Request completed successfully |
| `201 Created` | Created | A new resource was created |
| `204 No Content` | No Content | Resource deleted successfully (no response body) |
| `400 Bad Request` | Bad Request | Request payload or business rule validation failed |
| `401 Unauthorized` | Unauthorized | Authentication token is missing, expired, or invalid |
| `403 Forbidden` | Forbidden | Authenticated user lacks required role (e.g. User attempting Admin action) |
| `404 Not Found` | Not Found | Requested resource ID does not exist |
| `500 Internal Server Error` | Server Error | An unhandled server error occurred |

---

## Important Rules

- **JWT Authentication & Claims**: Protected endpoints require a valid JWT bearer token. Token expiration is 60 minutes with zero clock skew. User identity (`NameIdentifier`, `Name`, `Role`) is extracted directly from token claims.
- **Role Enforcement**: Standard `User` accounts have read-only access. All create, update, delete, and stock adjustment operations require the `Admin` role.
- **Category Reference**: Products must reference a valid `categoryId`. Assigning a non-existent category is rejected.
- **Category Name Uniqueness**: Category names must be unique across the catalog. Duplicate names are rejected with `400 Bad Request`.
- **Category Delete Protection**: Categories with active products assigned cannot be deleted (`DeleteBehavior.Restrict`).
- **Deficit Prevention**: Stock adjustments that would cause inventory to drop below zero are rejected with `400 Bad Request`.
- **Automatic Audit Tracking**: Transaction logs automatically record the authenticated user's ID from JWT claims, preventing audit spoofing.
- **Product Cascade Deletion**: Deleting a product removes its associated transaction history (`DeleteBehavior.Cascade`).
- **Client-Side Dashboard**: The frontend dashboard queries the product and category endpoints concurrently to compute metrics (total products, low stock items, total inventory value); there is no separate `/api/dashboard` backend endpoint.
