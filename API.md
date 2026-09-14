# 𝗜𝗡𝗩𝗘𝗡𝗧𝗢𝗥𝗬 𝗠𝗔𝗡𝗔𝗚𝗘𝗠𝗘𝗡𝗧 𝗦𝗬𝗦𝗧𝗘𝗠 𝗔𝗣𝗜
════════════════════════════════════════════════════════════

## 𝗢𝗩𝗘𝗥𝗩𝗜𝗘𝗪
──────────

The Inventory Management System API is a REST API built with ASP.NET Core and SQL Server.

It provides the backend for managing:

  • User accounts and authentication  
  • Products  
  • Categories  
  • Stock adjustments  
  • Inventory transaction history  

The API uses JWT authentication for secure access and supports role-based permissions for Standard Users and Administrators.


## 𝗕𝗔𝗦𝗘 𝗨𝗥𝗟
──────────

```text
http://localhost:5062/api
```


## 𝗔𝗨𝗧𝗛𝗘𝗡𝗧𝗜𝗖𝗔𝗧𝗜𝗢𝗡
────────────────

• User registration (`/api/auth/signup`) and login (`/api/auth/login`) are public.

• Logging in returns a JSON Web Token (JWT).

• Protected endpoints require the token sent in the HTTP Authorization header:
  `Authorization: Bearer <your-jwt-token>`

• Token expiration is set to 60 minutes with zero clock skew.

• User identity is read directly from token claims (`NameIdentifier`, `Name`, `Role`).


__Permissions__
───────────────

• User - Can view products, categories, and dashboard metrics. Blocked from write operations.

• Admin - Full access to create, edit, delete products and categories, execute stock adjustments, and view audit transaction history.


## 𝗘𝗡𝗗𝗣𝗢𝗜𝗡𝗧 𝗦𝗨𝗠𝗠𝗔𝗥𝗬
══════════════════

Authentication
──────────────
• POST /api/auth/signup  
  Public - Register a new user account.

• POST /api/auth/login  
  Public - Authenticate user and receive a JWT.


Products
────────
• GET /api/products  
  User, Admin - List, search, filter, and sort products with pagination.

• GET /api/products/{id}  
  User, Admin - Get product details by ID.

• POST /api/products  
  Admin - Create a new product.

• PUT /api/products/{id}  
  Admin - Update an existing product.

• DELETE /api/products/{id}  
  Admin - Delete a product.


Categories
──────────
• GET /api/categories  
  User, Admin - List all categories.

• GET /api/categories/{id}  
  User, Admin - Get category details by ID.

• POST /api/categories  
  Admin - Create a new category.

• PUT /api/categories/{id}  
  Admin - Update an existing category.

• DELETE /api/categories/{id}  
  Admin - Delete a category.


Inventory Transactions
──────────────────────
• GET /api/inventorytransactions  
  Admin - List all inventory transaction history.

• GET /api/inventorytransactions/{id}  
  Admin - Get transaction details by ID.

• GET /api/inventorytransactions/product/{id}  
  Admin - List transaction history for a specific product.

• POST /api/inventorytransactions  
  Admin - Record a stock adjustment transaction.


## 𝗔𝗣𝗜 𝗘𝗡𝗗𝗣𝗢𝗜𝗡𝗧𝗦
════════════════

### 𝗔𝗨𝗧𝗛𝗘𝗡𝗧𝗜𝗖𝗔𝗧𝗜𝗢𝗡
────────────────

__POST /api/auth/signup__
─────────────────────────

Registers a new user account with the standard User role.

Access: Public

__Request__
──────────

```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "johndoe@example.com",
  "password": "Password123!"
}
```

__Response__
──────────

```json
{
  "id": 3,
  "username": "johndoe",
  "email": "johndoe@example.com",
  "createdDate": "2026-09-14T10:15:30Z"
}
```

__Status Codes__
───────────────

• 200 OK  
  User registered successfully.

• 400 Bad Request  
  Username already taken or validation failure (password must be at least 8 characters, valid email required).



__POST /api/auth/login__
────────────────────────

Authenticates user credentials and returns a signed JWT.

Access: Public

__Request__
──────────

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "AdminPassword123!"
}
```

__Response (Success)__
─────────────────────

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

__Response (Invalid Credentials)__
─────────────────────────────────

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.2",
  "title": "Unauthorized.",
  "status": 401,
  "detail": "Invalid username or password."
}
```

__Status Codes__
───────────────

• 200 OK  
  Login successful, JWT returned.

• 400 Bad Request  
  Missing username or password.

• 401 Unauthorized  
  Invalid username or password.



### 𝗣𝗥𝗢𝗗𝗨𝗖𝗧𝗦
───────────

__GET /api/products__
─────────────────────

Retrieves a paginated list of products with optional search, sorting, category, and low-stock filters.

Access: User, Admin

__Query Parameters__
───────────────────

• search  
  Optional. Substring to match against product name.

• page  
  Optional. Default is 1. Page number must be at least 1.

• pageSize  
  Optional. Default is 10. Must be between 1 and 100.

• sortBy  
  Optional. Supported values are name, price, and quantity. Defaults to product ID.

• sortOrder  
  Optional. Default is asc. Supported values are asc and desc.

• lowStock  
  Optional. Default is false. When true, returns products with quantity less than or equal to 5.

__Request__
──────────

```http
GET /api/products?search=desk&page=1&pageSize=10&sortBy=price&sortOrder=asc
Authorization: Bearer <your-jwt-token>
```

__Response__
──────────

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

__Status Codes__
───────────────

• 200 OK  
  Products retrieved successfully.

• 400 Bad Request  
  Invalid page or pageSize query parameters.

• 401 Unauthorized  
  Missing or invalid token.



__GET /api/products/{id}__
──────────────────────────

Retrieves full details for a single product by ID.

Access: User, Admin

__Request__
──────────

```http
GET /api/products/1
Authorization: Bearer <your-jwt-token>
```

__Response__
──────────

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

__Status Codes__
───────────────

• 200 OK  
  Product found.

• 401 Unauthorized  
  Missing or invalid token.

• 404 Not Found  
  Product ID does not exist.



__POST /api/products__
──────────────────────

Creates a new product item in the inventory catalog.

Access: Admin

__Request__
──────────

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

__Response__
──────────

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

__Status Codes__
───────────────

• 201 Created  
  Product created successfully.

• 400 Bad Request  
  Validation error or referenced category ID does not exist.

• 401 Unauthorized  
  Missing or invalid token.

• 403 Forbidden  
  User is not an Admin.



__PUT /api/products/{id}__
──────────────────────────

Updates an existing product's name, quantity, price, or category.

Access: Admin

__Request__
──────────

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

__Response__
──────────

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

__Status Codes__
───────────────

• 200 OK  
  Product updated successfully.

• 400 Bad Request  
  Validation failure or referenced category does not exist.

• 401 Unauthorized  
  Missing or invalid token.

• 403 Forbidden  
  User is not an Admin.

• 404 Not Found  
  Product ID not found.



__DELETE /api/products/{id}__
─────────────────────────────

Deletes a product from the database.

Access: Admin

__Request__
──────────

```http
DELETE /api/products/5
Authorization: Bearer <your-jwt-token>
```

__Response__
──────────

```http
HTTP/1.1 204 No Content
```

__Status Codes__
───────────────

• 204 No Content  
  Product deleted successfully.

• 401 Unauthorized  
  Missing or invalid token.

• 403 Forbidden  
  User is not an Admin.

• 404 Not Found  
  Product ID not found.



### 𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗜𝗘𝗦
─────────────

__GET /api/categories__
───────────────────────

Retrieves all product categories.

Access: User, Admin

__Request__
──────────

```http
GET /api/categories
Authorization: Bearer <your-jwt-token>
```

__Response__
──────────

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

__Status Codes__
───────────────

• 200 OK  
  Categories retrieved successfully.

• 401 Unauthorized  
  Missing or invalid token.



__GET /api/categories/{id}__
────────────────────────────

Retrieves single category details by ID.

Access: User, Admin

__Request__
──────────

```http
GET /api/categories/1
Authorization: Bearer <your-jwt-token>
```

__Response__
──────────

```json
{
  "id": 1,
  "name": "Electronics",
  "description": "Laptops, monitors, and cables",
  "createdDate": "2026-09-11T07:30:00Z"
}
```

__Status Codes__
───────────────

• 200 OK  
  Category found.

• 401 Unauthorized  
  Missing or invalid token.

• 404 Not Found  
  Category ID does not exist.



__POST /api/categories__
────────────────────────

Creates a new product category.

Access: Admin

__Request__
──────────

```http
POST /api/categories
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Packaging Supplies",
  "description": "Boxes, tape, bubble wrap, and shipping containers"
}
```

__Response__
──────────

```json
{
  "id": 3,
  "name": "Packaging Supplies",
  "description": "Boxes, tape, bubble wrap, and shipping containers",
  "createdDate": "2026-09-14T11:45:00Z"
}
```

__Status Codes__
───────────────

• 201 Created  
  Category created successfully.

• 400 Bad Request  
  Category name already exists or required name field missing.

• 401 Unauthorized  
  Missing or invalid token.

• 403 Forbidden  
  User is not an Admin.



__PUT /api/categories/{id}__
────────────────────────────

Updates an existing category name and description.

Access: Admin

__Request__
──────────

```http
PUT /api/categories/3
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Shipping & Packaging",
  "description": "Boxes, labels, bubble wrap, and shipping supplies"
}
```

__Response__
──────────

```json
{
  "id": 3,
  "name": "Shipping & Packaging",
  "description": "Boxes, labels, bubble wrap, and shipping supplies",
  "createdDate": "2026-09-14T11:45:00Z"
}
```

__Status Codes__
───────────────

• 200 OK  
  Category updated successfully.

• 400 Bad Request  
  Category name conflict with another existing category.

• 401 Unauthorized  
  Missing or invalid token.

• 403 Forbidden  
  User is not an Admin.

• 404 Not Found  
  Category ID not found.



__DELETE /api/categories/{id}__
───────────────────────────────

Deletes a category from the system.

Access: Admin

__Request__
──────────

```http
DELETE /api/categories/2
Authorization: Bearer <your-jwt-token>
```

__Response (Success)__
─────────────────────

```http
HTTP/1.1 204 No Content
```

__Response (Failure - Category has active products)__
────────────────────────────────────────────────────

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "Invalid request.",
  "status": 400,
  "detail": "Cannot delete a category that has products."
}
```

__Status Codes__
───────────────

• 204 No Content  
  Category deleted successfully.

• 400 Bad Request  
  Cannot delete category because products are currently assigned to it.

• 401 Unauthorized  
  Missing or invalid token.

• 403 Forbidden  
  User is not an Admin.

• 404 Not Found  
  Category ID not found.



### 𝗜𝗡𝗩𝗘𝗡𝗧𝗢𝗥𝗬 𝗧𝗥𝗔𝗡𝗦𝗔𝗖𝗧𝗜𝗢𝗡𝗦
──────────────────────────────

__POST /api/inventorytransactions__
───────────────────────────────────

Records a stock adjustment, updates product stock level, and logs an audit transaction record. The user ID is automatically extracted from the JWT token.

Access: Admin

__Transaction Types__
────────────────────

• Restock  
  Quantity must be positive. Adds stock.

• Return  
  Quantity must be positive. Adds stock.

• Sale  
  Quantity must be negative. Removes stock.

• Damage  
  Quantity must be negative. Removes stock.

__Example 1: Restock Request (+10 Units)__
──────────────────────────────────────────

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

__Response (200 OK)__
────────────────────

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

__Example 2: Sale Request (-3 Units)__
──────────────────────────────────────

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

__Response (200 OK)__
────────────────────

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

__Example 3: Negative Stock Error (Deducting more units than available)__
────────────────────────────────────────────────────────────────────────

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "Invalid request.",
  "status": 400,
  "detail": "Inventory quantity cannot be negative."
}
```

__Status Codes__
───────────────

• 200 OK  
  Stock updated and transaction logged.

• 400 Bad Request  
  Product not found, or quantity change would result in negative stock.

• 401 Unauthorized  
  Missing or invalid token.

• 403 Forbidden  
  User is not an Admin.



__GET /api/inventorytransactions__
──────────────────────────────────

Lists all inventory transaction records ordered from newest to oldest.

Access: Admin

__Request__
──────────

```http
GET /api/inventorytransactions
Authorization: Bearer <your-jwt-token>
```

__Response__
──────────

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

__Status Codes__
───────────────

• 200 OK  
  Transactions retrieved.

• 401 Unauthorized  
  Missing or invalid token.

• 403 Forbidden  
  User is not an Admin.



__GET /api/inventorytransactions/{id}__
───────────────────────────────────────

Retrieves details for a single transaction by ID.

Access: Admin

__Request__
──────────

```http
GET /api/inventorytransactions/12
Authorization: Bearer <your-jwt-token>
```

__Response__
──────────

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

__Status Codes__
───────────────

• 200 OK  
  Transaction found.

• 401 Unauthorized  
  Missing or invalid token.

• 403 Forbidden  
  User is not an Admin.

• 404 Not Found  
  Transaction ID not found.



__GET /api/inventorytransactions/product/{productId}__
──────────────────────────────────────────────────────

Lists all transaction history records for a single product.

Access: Admin

__Request__
──────────

```http
GET /api/inventorytransactions/product/1
Authorization: Bearer <your-jwt-token>
```

__Response__
──────────

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

__Status Codes__
───────────────

• 200 OK  
  Product transactions retrieved.

• 401 Unauthorized  
  Missing or invalid token.

• 403 Forbidden  
  User is not an Admin.



## 𝗘𝗥𝗥𝗢𝗥 𝗥𝗘𝗦𝗣𝗢𝗡𝗦𝗘𝗦
────────────────

The API formats all error responses using the standard RFC 7807 ProblemDetails specification.


__1. Business Rule Failure (400 Bad Request)__
─────────────────────────────────────────────

Returned when a business validation rule fails:

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "Invalid request.",
  "status": 400,
  "detail": "Inventory quantity cannot be negative."
}
```


__2. Model Validation Failure (400 Bad Request)__
────────────────────────────────────────────────

Returned when input fields fail DataAnnotation constraints:

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


__Common HTTP Status Codes__
────────────────────────────

• 200 OK  
  Request completed successfully.

• 201 Created  
  A new resource was created.

• 204 No Content  
  Resource was deleted successfully.

• 400 Bad Request  
  Request data or business rules are invalid.

• 401 Unauthorized  
  Authentication token is missing, expired, or invalid.

• 403 Forbidden  
  Authenticated user lacks the required role (e.g. standard User attempting Admin action).

• 404 Not Found  
  Requested resource ID does not exist.

• 500 Internal Server Error  
  An unexpected server error occurred.



## 𝗜𝗠𝗣𝗢𝗥𝗧𝗔𝗡𝗧 𝗥𝗨𝗟𝗘𝗦
─────────────────

• **Category Reference**: Products must reference an existing category ID. Creating or updating a product with an invalid category ID is rejected.

• **Category Name Uniqueness**: Category names must be unique across the catalog. Duplicate names are rejected.

• **Category Delete Protection**: A category with products assigned to it cannot be deleted.

• **No Negative Inventory**: Transactions that would cause product stock to fall below zero are rejected.

• **Automatic User Tracking**: When recording an inventory adjustment, the user ID is securely taken from the JWT token, ensuring an authentic audit log.

• **Product Deletion Cascade**: Deleting a product removes its associated transaction history from the database.

• **Role Enforcement**: Standard users can view products and categories, but all create, edit, delete, and stock adjustment operations are restricted to Admin accounts.
