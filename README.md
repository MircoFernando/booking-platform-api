# EN2H Software Engineer Intern Technical Assignment – Booking Platform REST API

An enterprise-ready Booking Platform REST API built with **NestJS**, **TypeScript**, and **PostgreSQL (via Prisma ORM)**. This API allows merchants to manage services and customers to create and manage bookings, featuring robust authentication, secure database design, and structured exception wrapping.

---

## 🚀 Project Overview

The Booking Platform REST API is a scalable backend service structured following NestJS architectural best practices. It implements JWT token-based authentication (supporting dual tokens: short-lived Access Tokens and long-lived Refresh Tokens with secure Argon2 hashing), Service management, and Booking reservation slots with automated collision checks at the database layer.

---

## 🛠️ Tech Stack

* **Framework**: NestJS (v11)
* **Language**: TypeScript
* **Database**: PostgreSQL (Prisma ORM)
* **Security**: Passport.js (JWT Access & Refresh Strategy), Argon2 password hashing
* **Validation**: class-validator & class-transformer
* **Containerization**: Docker & Docker Compose
* **API Specs**: Swagger (OpenAPI 3.0)

---

## ⚙️ Environment Variables

A `.env.example` file is included in the project root. Create a `.env` file in the root directory and configure the following variables:

```env
# Application configuration
PORT=3000
NODE_ENV=development

# Database configuration (PostgreSQL)
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=booking_platform
DATABASE_PORT=5432
DATABASE_HOST=localhost

# Prisma-specific connection string
DATABASE_URL="postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}?schema=public"

# JWT configuration
JWT_SECRET=super_secret_access_key_change_me
JWT_REFRESH_SECRET=super_secret_refresh_key_change_me
```

---

## 📦 Installation & Setup

### Option 1: Running with Docker (Recommended)

The project includes pre-configured `Dockerfile` and `compose.yaml` setups to orchestrate the Node.js application and the PostgreSQL database out of the box.

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd booking-platform-api
   ```
2. **Setup environment variables**:
   ```bash
   cp .env.example .env
   ```
3. **Start the containers**:
   ```bash
   docker compose up -d --build
   ```
   *This command spins up the database, runs database migrations/synchronizations, builds the application, and exposes it on port `3000`.*
4. **Access Swagger Documentation**:
   👉 Open [http://localhost:3000/docs](http://localhost:3000/docs) in your browser.

---

### Option 2: Running Locally

If you prefer to run the application on your host machine:

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Setup Database (Docker)**:
   You can spin up only the PostgreSQL database using Docker:
   ```bash
   docker compose up -d db
   ```
3. **Configure Environment**:
   Ensure your `.env` file has the correct database credentials targeting `localhost` instead of `db`.
4. **Synchronize Schema**:
   Generate the Prisma Client and push the schema directly to your Postgres database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. **Run the Server**:
   ```bash
   # Development mode with watch loop
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

---

## 🗄️ Database Design & Sync

The database schema is defined in [schema.prisma](prisma/schema.prisma) and maps out three main tables:
1. **`users`**: Contains credential records, hashed passwords, and refresh token hashes.
2. **`services`**: Contains details of services (`title`, `duration`, `price`, `isActive`, etc.) created by merchants.
3. **`bookings`**: Contains reservation details (`customerName`, `bookingDate`, `bookingTime`, `status`, `notes`, etc.) tied to a parent service.

### Schema Sync and Migrations
* To sync schema changes directly during development:
  ```bash
  npx prisma db push
  ```
* To create a formal SQL migration history file:
  ```bash
  npx prisma migrate dev --name <migration-name>
  ```
* Migrations will be generated under the `prisma/migrations` folder and can be applied in production environments using:
  ```bash
  npx prisma migrate deploy
  ```

---

## 📖 API Documentation (Swagger)

Interactive Swagger API specifications are exposed at:
👉 **`http://localhost:3000/docs`**

The documentation allows you to directly try out all endpoints:
* Use the **Authorize** lock button in the top right to paste your JWT Access Token (`Bearer <token>`) to unlock authenticated endpoints.

### Quick Route Overview

#### 1. Authentication
* `POST /api/v1/auth/register` - Create a new user profile.
* `POST /api/v1/auth/login` - Authenticate credentials and get Access & Refresh Tokens.
* `POST /api/v1/auth/logout` - Invalidate the refresh token (Requires authentication).
* `POST /api/v1/auth/refresh` - Rotate tokens using a valid refresh token header.

#### 2. Service Management
* `POST /api/v1/services` - Create a new service (Requires authentication).
* `GET /api/v1/services` - Get a list of all active services (Requires authentication).
* `GET /api/v1/services/:id` - Fetch details of a single service by ID (Requires authentication).
* `PATCH /api/v1/services/:id` - Update service details (Requires authentication).
* `DELETE /api/v1/services/:id` - Delete a service (Requires authentication).

#### 3. Booking Management
* `POST /api/v1/bookings` - Create a new reservation slot (Public Endpoint).
* `GET /api/v1/bookings` - Retrieve all bookings (Requires authentication).
  * *Supports filtering by `status`, partial `search` query, cursor pagination limit (`limit`), and cursor index (`cursor`).*
* `GET /api/v1/bookings/:id` - Fetch details of a single booking (Requires authentication).
* `PATCH /api/v1/bookings/:id/status` - Update status (Requires authentication).
* `PATCH /api/v1/bookings/:id/cancel` - Cancel a booking (Requires authentication).

---

## 🧠 Design Assumptions Made

1. **Booking Time Storage & Comparison**: 
   Dates and times are separated into database fields (`bookingDate` as `Date` and `bookingTime` as `Time`). Date validations check that the date is not in the past using a normalized midnight UTC comparison to ensure that bookings on the current calendar date are accepted regardless of local time-zone offsets.
2. **Duplicate Booking Prevention (P2002)**:
   A composite unique index `@@unique([serviceId, bookingDate, bookingTime])` is applied directly at the database level. This guarantees that booking collisions are prevented at the transaction level under high concurrency. The global exception filter captures this Prisma `P2002` error and maps it to a clear `409 ConflictException`.
3. **Cursor-Based Pagination**:
   We implemented native lookahead cursor pagination (`take: limit + 1`) instead of offset pagination (`skip`/`take`). Under large volumes, offset pagination requires scanning all preceding rows, causing a performance degradation. Cursor-based pagination provides stable `O(1)` operations.
4. **Structured Error/Success Envelope**:
   To ensure client-side compatibility and clean responses, all responses are enveloped:
   * **Success Interceptor**: Wraps API successes as `{ success: true, data, meta: { requestId, timestamp, apiVersion } }`.
   * **Global Exceptions Filter**: Catches any thrown exceptions and formats them as `{ success: false, error: { statusCode, message }, meta: { requestId, timestamp, apiVersion } }`.

---

## 🔮 Future Improvements

1. **Notification Queueing**: Integrate a Redis-backed queue system (e.g. BullMQ) to send email or SMS reminders to customers automatically prior to their booking slot without blocking main thread API requests.
2. **Soft Deletion for Services**: Rather than hard-deleting services from the system, introduce an `isDeleted` boolean. This prevents orphans in booking tables and preserves historical booking audits.
3. **Caching Layer**: Cache read-heavy endpoints like `GET /services` using Redis to improve response times and decrease load on the database.
