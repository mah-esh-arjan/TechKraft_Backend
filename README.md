# Real Estate Listing Search API

This is a backend service developed for a mid-level full-stack engineer take-home assessment. It provides a robust property search system with filtering, pagination, and role-based data visibility.

## 🚀 Features

- **Advanced Property Search**: Filter by price range, beds, baths, property type, and keyword.
- **Role-Aware Feedback**: Administrative users see internal metadata (e.g., status notes, square feet, year built) while public users only see core property details.
- **Performance Optimized**: Includes database indexes on commonly searched fields (`price`, `suburb`, etc.).
- **Consistent Scaling**: Full separation of concerns following the Controller-Repository pattern.
- **Standardized Pagination**: Offset-based pagination with total calculations for frontend consistency.

---

## 🛠️ Prerequisites

- **Node.js**: v18.x or higher
- **Postgres Database**: Local instance or Docker container
- **Typescript**: Project uses `tsx` and `vitest` for development and testing

---

## 🏃 Getting Started

### 1. Installation

Install all required dependencies:

```bash
npm install
```

### 2. Environment Configuration

The application requires a `.env` file in the root directory. You can copy the template provided:

```bash
cp .env.example .env
```

After copying, update the `DATABASE_URL` with your local PostgreSQL credentials.

### 3. Database Migration & Seeding

Sync the Prisma schema with your local database and populate it with mock data:

```bash
# Push schema to DB
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed the database (uses @faker-js/faker to create 5 agents and 40 properties)
npx prisma db seed
```

---

## 💻 Running the Application

### Development Mode (auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm run start
```

---

## 🧪 Testing

The project uses `Vitest` and `Supertest` for integration testing.

```bash
npm run test
```

Current tests cover:
- Property list retrieval with pagination
- Filter logic (keyword, price, etc.)
- **Role-aware metadata filtering** (Admin vs Public visibility)
- Error handling for invalid IDs

---

## 📡 API Documentation & Examples

### GET /listings
Fetch properties with optional filters and pagination.

**Example Request**:
`GET /listings?beds=2&minPrice=100000&maxPrice=800000&page=1&limit=5`

**Admin Access**:
Add `x-admin: true` to the request headers to see extended metadata like `squareFeet`, `yearBuilt`, `hasPool`, and `hasGarage`.

### GET /listings/:id
Fetch a single property's core details by its unique internal ID.

---

## 📂 Project Structure

- `src/controllers`: Request handling and filtering logic.
- `src/repositories`: Direct data access layer via Prisma.
- `src/dto`: Shared interfaces for input validation and output types.
- `src/routes`: API endpoint definitions.
- `src/app.ts`: Core application configuration.
- `prisma/`: Database schema and seeding scripts.
- `src/tests/`: Integration tests.

---

## 📜 Evaluation Checklist (Self-Assessment)

- [x] **Clear separation of concerns** (Controller, Repository, Data-Layer).
- [x] **Relational DB logic** with `Agent` <-> `Property` relationships.
- [x] **Search/Filter functionality** (price, beds, baths, keyword, type).
- [x] **Database Performance** via indexes on common search patterns.
- [x] **Role-Based Behavior** (Metadata hidden for normal users, visible for `x-admin`).
- [x] **REST Consistency** and clean DTO-to-Output mapping.
- [x] **Small but complete** with unit/integration testing and setup docs.
