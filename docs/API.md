# Falling Upward API Documentation

## Overview
This document provides comprehensive documentation for the Falling Upward backend API endpoints.

**Base URL**: `https://your-domain.com/api` (or `http://localhost:3000/api` for development)

## Authentication
- **Admin endpoints** require NextAuth session with `role: "admin"`
- **User endpoints** are public but include internal validation
- **Rate limiting** is applied to all endpoints

## Rate Limits
| Endpoint Type | Limit | Window | Purpose |
|---------------|-------|---------|---------|
| `/api/auth/*` | 5 requests | 15 min | Brute force protection |
| `/api/admin/*` | 100 requests | 15 min | Admin operations |
| `/api/send-email` | 10 requests | 1 hour | Email spam prevention |
| `/api/user/*` | 200 requests | 15 min | User operations |
| `/api/workbook/*` | 50 requests | 5 min | Workbook operations |
| Other APIs | 300 requests | 15 min | General protection |

## Endpoints

### Health Check
#### `GET /api/health`
Check system health and service status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T18:20:04.000Z",
  "uptime": 3600,
  "responseTime": "45ms",
  "version": "1.0.0",
  "environment": "production",
  "services": {
    "database": "connected",
    "email": "configured",
    "auth": "configured"
  }
}
```

### Email Service
#### `POST /api/send-email`
Send booking confirmation emails.

**Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "consultationTypeLabel": "Initial Consultation",
  "message": "Optional message",
  "formType": "booking"
}
```

**Validation Rules:**
- `name`: 2-100 characters, letters/spaces/hyphens only
- `email`: Valid email format, max 254 characters
- `phone`: 10-20 characters, digits/spaces/symbols only
- `consultationTypeLabel`: Required, max 200 characters
- `message`: Optional, max 2000 characters

**Response:**
```json
{
  "success": true,
  "message": "Form submitted successfully. Email notification has been sent.",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "type": "Initial Consultation"
  }
}
```

### Admin Endpoints

#### `GET /api/admin/users`
Get all users with pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

**Response:**
```json
{
  "users": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

#### `POST /api/admin/users`
Create a new user.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "workbooks": ["workbook_id_1", "workbook_id_2"],
  "role": "user"
}
```

#### `GET /api/admin/users/[id]`
Get specific user by ID.

#### `PUT /api/admin/users/[id]`
Update user information.

#### `DELETE /api/admin/users/[id]`
Delete user and associated data.

#### `POST /api/admin/users/[id]/complete`
Mark user as completed.

#### `GET /api/admin/workbooks`
Get all workbooks.

#### `POST /api/admin/workbooks`
Create a new workbook template.

**Request Body:**
```json
{
  "title": "Workbook Title",
  "description": "Optional description",
  "questions": [
    {
      "id": "q1",
      "type": "text",
      "question": "What is your name?",
      "required": true
    }
  ],
  "isTemplate": true
}
```

#### `GET /api/admin/workbooks/[id]`
Get specific workbook.

#### `PUT /api/admin/workbooks/[id]`
Update workbook.

#### `DELETE /api/admin/workbooks/[id]`
Delete workbook.

#### `POST /api/admin/workbooks/assign`
Assign workbooks to users.

**Request Body:**
```json
{
  "userIds": ["user_id_1", "user_id_2"],
  "workbookIds": ["workbook_id_1", "workbook_id_2"]
}
```

#### `DELETE /api/admin/workbooks/assign`
Unassign workbook from user.

#### `POST /api/admin/send-user-email`
Send dashboard link to user.

#### `GET /api/admin/rate-limit-stats`
Get rate limiting statistics (admin only).

### User Endpoints

#### `GET /api/user/[id]/workbooks`
Get user's assigned workbooks.

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "workbooks": [...]
}
```

#### `POST /api/user/[id]/workbooks`
Submit completed workbooks.

**Request Body:**
```json
{
  "workbooks": [
    {
      "workbookId": "workbook_id",
      "responses": {
        "q1": "Answer 1",
        "q2": "Answer 2"
      }
    }
  ]
}
```

### Workbook Endpoints

#### `GET /api/workbook/[id]`
Get workbook for user access (with ownership validation).

#### `PUT /api/workbook/[id]`
Update workbook responses.

#### `GET /api/workbook/[id]/submission`
Get workbook submission details.

### Authentication

#### `GET/POST /api/auth/[...nextauth]`
NextAuth.js authentication endpoints.

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE" // Optional
}
```

### HTTP Status Codes
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `429`: Too Many Requests (rate limited)
- `500`: Internal Server Error
- `503`: Service Unavailable (health check failed)

## Security Features

### CORS Policy
- **Development**: Allows localhost origins
- **Production**: Restricts to configured domain only
- **Headers**: Includes security headers and credentials support

### Rate Limiting
- **IP + User Agent** based identification
- **Fail-open** design (errors don't block requests)
- **Automatic cleanup** prevents memory leaks
- **Custom limits** per endpoint type

### Input Validation
- **Zod schemas** for all request validation
- **Sanitization** of user inputs
- **Type safety** with TypeScript
- **Detailed error messages** for validation failures

### Security Headers
- **CSP**: Content Security Policy
- **HSTS**: HTTP Strict Transport Security
- **X-Frame-Options**: Clickjacking protection
- **X-Content-Type-Options**: MIME sniffing protection

## Monitoring & Logging

### Structured Logging
- **Development**: Pretty-printed console output
- **Production**: JSON structured logs for aggregation
- **Context**: Request ID, user ID, IP, endpoint tracking
- **Performance**: Response time tracking
- **Security**: Authentication and authorization events

### Health Monitoring
- **Database connectivity** checks
- **Service configuration** validation
- **Response time** monitoring
- **Uptime** tracking

## Development

### Environment Variables
```bash
MONGODB_URI=mongodb://...
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
RESEND_API_KEY=re_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Testing
Use the health endpoint to verify system status:
```bash
curl http://localhost:3000/api/health
```

### Rate Limit Testing
Monitor rate limits via admin endpoint:
```bash
curl -H "Authorization: Bearer admin_token" \
  http://localhost:3000/api/admin/rate-limit-stats
```

## Production Deployment

### Pre-deployment Checklist
- [ ] Environment variables configured
- [ ] Database indexes created
- [ ] Rate limiting tested
- [ ] Security headers verified
- [ ] Health checks working
- [ ] Logging configured
- [ ] CORS policy set correctly

### Monitoring
- Monitor `/api/health` endpoint
- Set up log aggregation for structured logs
- Configure alerts for rate limit violations
- Monitor database performance with indexes

---

**Last Updated**: January 15, 2025  
**API Version**: 1.0.0
