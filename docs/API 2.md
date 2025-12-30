# API Documentation

RESTful API documentation for the Full Stack Web Developer Assignment backend.

## Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
- [Status Codes](#status-codes)

## Overview

This document describes the RESTful API endpoints available in the backend application. The API follows REST principles and returns JSON responses.

### API Version

Current Version: **v1**

### Content Type

All requests and responses use JSON format:

```
Content-Type: application/json
Accept: application/json
```

## Base URL

### Development
```
http://localhost:8000/api
```

### Production
```
https://api.yourdomain.com/api
```

## Authentication

> **Status**: To be implemented

Authentication will be implemented using Laravel Sanctum for SPA authentication.

### Planned Authentication Flow

```http
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "1|abc123...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com"
    }
  }
}
```

### Using Authentication Token

```http
GET /api/user
Authorization: Bearer {token}
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Operation successful",
  "meta": {
    "timestamp": "2025-12-29T08:00:00Z"
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [
    // Array of items
  ],
  "meta": {
    "current_page": 1,
    "total_pages": 10,
    "per_page": 15,
    "total": 150,
    "from": 1,
    "to": 15
  },
  "links": {
    "first": "http://api.example.com/items?page=1",
    "last": "http://api.example.com/items?page=10",
    "prev": null,
    "next": "http://api.example.com/items?page=2"
  }
}
```

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error message here",
  "errors": {
    "field_name": [
      "Validation error message"
    ]
  },
  "meta": {
    "timestamp": "2025-12-29T08:00:00Z"
  }
}
```

### Validation Error Example

```json
{
  "success": false,
  "message": "The given data was invalid.",
  "errors": {
    "email": [
      "The email field is required."
    ],
    "password": [
      "The password must be at least 8 characters."
    ]
  }
}
```

## Endpoints

> **Note**: Specific endpoints will be documented as they are implemented.

### Planned Endpoint Categories

#### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `POST /api/refresh` - Refresh token
- `GET /api/user` - Get authenticated user

#### Users
- `GET /api/users` - List all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

#### Example Endpoint Documentation

---

### Get All Users

Retrieve a paginated list of all users.

**Endpoint:** `GET /api/users`

**Authentication:** Required

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| per_page | integer | No | Items per page (default: 15, max: 100) |
| search | string | No | Search by name or email |
| sort_by | string | No | Sort field (default: created_at) |
| sort_order | string | No | Sort order: asc/desc (default: desc) |

**Example Request:**

```http
GET /api/users?page=1&per_page=20&search=john&sort_by=name&sort_order=asc
Authorization: Bearer {token}
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "total_pages": 5,
    "per_page": 20,
    "total": 100
  }
}
```

---

### Get User by ID

Retrieve a specific user by their ID.

**Endpoint:** `GET /api/users/{id}`

**Authentication:** Required

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | User ID |

**Example Request:**

```http
GET /api/users/1
Authorization: Bearer {token}
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
}
```

**Error Response (Not Found):**

```json
{
  "success": false,
  "message": "User not found",
  "meta": {
    "timestamp": "2025-12-29T08:00:00Z"
  }
}
```

---

### Create User

Create a new user.

**Endpoint:** `POST /api/users`

**Authentication:** Required

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Validation Rules:**

| Field | Rules |
|-------|-------|
| name | required, string, max:255 |
| email | required, email, unique:users |
| password | required, string, min:8, confirmed |

**Example Response:**

```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2025-12-29T08:00:00Z",
    "updated_at": "2025-12-29T08:00:00Z"
  },
  "message": "User created successfully"
}
```

---

## Status Codes

The API uses standard HTTP status codes:

### Success Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Request successful, no content to return |

### Client Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid request format |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |

### Server Error Codes

| Code | Description |
|------|-------------|
| 500 | Internal Server Error - Server error occurred |
| 503 | Service Unavailable - Server temporarily unavailable |

## Rate Limiting

> **Status**: To be implemented

Planned rate limits:
- **Authenticated requests**: 60 requests per minute
- **Unauthenticated requests**: 30 requests per minute

Rate limit headers will be included in responses:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1640000000
```

## Versioning

The API uses URL versioning. Future versions will be available at:

```
/api/v2/...
/api/v3/...
```

Current version (v1) is available without version prefix for backward compatibility.

## CORS

Cross-Origin Resource Sharing (CORS) is enabled for:

- **Development**: `http://localhost:3000`
- **Production**: Configured domains only

## Testing the API

### Using cURL

```bash
# Example: Get users
curl -X GET http://localhost:8000/api/users \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```

### Using Postman

1. Import the API collection (coming soon)
2. Set environment variables
3. Test endpoints

### Using HTTPie

```bash
# Example: Create user
http POST http://localhost:8000/api/users \
  name="John Doe" \
  email="john@example.com" \
  password="password123" \
  password_confirmation="password123" \
  Authorization:"Bearer {token}"
```

## Changelog

### Version 1.0.0 (2025-12-29)

- Initial API documentation
- Defined response formats
- Planned endpoint structure

---

**Note**: This documentation will be updated as new endpoints are implemented.

For implementation details, see [Architecture Documentation](ARCHITECTURE.md).
