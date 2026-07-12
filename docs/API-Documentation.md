# Booking Platform API Reference Manual

The Booking Platform REST API is a structured, fully enveloped endpoint set. This manual details standard envelopes, authentication routines, and route lists.

---

## 🌐 Live API Playground

The interactive OpenAPI Swagger UI is available at:
👉 **[http://178.128.17.103:3000/docs](http://178.128.17.103:3000/docs)**

You can view raw JSON/YAML specifications directly:
* **JSON Format Spec**: `http://178.128.17.103:3000/docs-json`
* **YAML Format Spec**: `http://178.128.17.103:3000/docs-yaml`

---

## 📬 Response & Error Envelope Structure

All API responses are wrapped in a standard JSON structure.

### 1. Success Envelope (HTTP 200/201 Series)
```json
{
  "success": true,
  "data": {
    "id": "e85e05a8-202a-4a25-9df0-7d72111d4e7f",
    "name": "Jane Doe"
  },
  "meta": {
    "requestId": "req_84d72d2e",
    "timestamp": "2026-07-12T10:50:00.123Z",
    "apiVersion": "v1"
  }
}
```

### 2. Error Envelope (HTTP 400/401/404/500 Series)
```json
{
  "success": false,
  "error": {
    "statusCode": 409,
    "message": "Time slot already booked for this service."
  },
  "meta": {
    "requestId": "req_93f82d1c",
    "timestamp": "2026-07-12T10:51:10.456Z",
    "apiVersion": "v1"
  }
}
```

---

## 🔑 Authentication Flow (Dual-Token JWT)

Authenticated endpoints require a Bearer Access Token in the request headers:
`Authorization: Bearer <your_access_token>`

### 1. Retrieve Tokens
Send credentials to `/api/v1/auth/login`. You will receive:
* **`accessToken`**: Short-lived token (15m expiry).
* **`refreshToken`**: Long-lived token (7d expiry) sent as a cookie and in response parameters.

### 2. Token Rotation (Automatic Refresh)
When the `accessToken` expires, call the token rotation route:
* **Route**: `/api/v1/auth/refresh`
* **Header**: Pass your refresh token in the authorization header:
  `Authorization: Bearer <your_refresh_token>`
* **Result**: You will receive a new `accessToken` and `refreshToken` pair.

---

## 📖 Endpoint Directory

### 1. Authentication Module (`/api/v1/auth`)

#### Register User
* **Method**: `POST`
* **Route**: `/api/v1/auth/register`
* **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "strongpassword123",
    "name": "Jane Doe"
  }
  ```

#### Login
* **Method**: `POST`
* **Route**: `/api/v1/auth/login`
* **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "strongpassword123"
  }
  ```

#### Logout
* **Method**: `POST`
* **Route**: `/api/v1/auth/logout`
* **Auth**: Required (Bearer Access Token)

#### Refresh Tokens
* **Method**: `POST`
* **Route**: `/api/v1/auth/refresh`
* **Auth**: Required (Bearer Refresh Token)

---

### 2. Service Management Module (`/api/v1/services`)

#### Create Service
* **Method**: `POST`
* **Route**: `/api/v1/services`
* **Auth**: Required
* **Body**:
  ```json
  {
    "title": "Haircut appointment",
    "description": "Standard mens trim",
    "duration": 30,
    "price": 45.00
  }
  ```

#### Get All Active Services
* **Method**: `GET`
* **Route**: `/api/v1/services`
* **Auth**: Required

#### Get Service Detail
* **Method**: `GET`
* **Route**: `/api/v1/services/:id`
* **Auth**: Required

#### Edit Service
* **Method**: `PATCH`
* **Route**: `/api/v1/services/:id`
* **Auth**: Required
* **Body**: (Optional fields)
  ```json
  {
    "title": "Extended Haircut",
    "duration": 45
  }
  ```

#### Delete Service
* **Method**: `DELETE`
* **Route**: `/api/v1/services/:id`
* **Auth**: Required

---

### 3. Booking Management Module (`/api/v1/bookings`)

#### Create Booking Slot
* **Method**: `POST`
* **Route**: `/api/v1/bookings`
* **Auth**: Public (Anyone can book)
* **Body**:
  ```json
  {
    "serviceId": "e85e05a8-202a-4a25-9df0-7d72111d4e7f",
    "customerName": "John Customer",
    "customerEmail": "john@customer.com",
    "customerPhone": "+1234567890",
    "bookingDate": "2026-08-15",
    "bookingTime": "14:30:00",
    "notes": "Prefer window seat"
  }
  ```

#### Get All Bookings (Paginated & Filtered)
* **Method**: `GET`
* **Route**: `/api/v1/bookings`
* **Auth**: Required
* **Query Parameters** (Optional):
  * `status`: Filter by `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`
  * `search`: Filter by customer name/email/phone substring matches
  * `limit`: Number of records to return (defaults to 10)
  * `cursor`: Cursor UUID index for lookahead pagination

#### Get Booking by ID
* **Method**: `GET`
* **Route**: `/api/v1/bookings/:id`
* **Auth**: Required

#### Update Booking Status
* **Method**: `PATCH`
* **Route**: `/api/v1/bookings/:id/status`
* **Auth**: Required
* **Body**:
  ```json
  {
    "status": "CONFIRMED"
  }
  ```

#### Cancel Booking
* **Method**: `PATCH`
* **Route**: `/api/v1/bookings/:id/cancel`
* **Auth**: Required

---

### 4. Users Module (`/api/v1/users`)

#### Retrieve All Users
* **Method**: `GET`
* **Route**: `/api/v1/users`
* **Auth**: Required

#### Retrieve User by ID
* **Method**: `GET`
* **Route**: `/api/v1/users/find`
* **Auth**: Required
* **Query Parameters**:
  * `id`: The UUID of the user to fetch (`/api/v1/users/find?id=e85e05a8...`)
