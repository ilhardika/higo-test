# Higo Customer Analytics Backend

Backend API untuk dashboard analitik customer dengan Express.js, MongoDB, dan TypeScript.

## Setup Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env sesuai konfigurasi local MongoDB
```

### 3. Start MongoDB

```bash
# Option 1: Docker (Recommended)
docker run --name mongo-higo -p 27017:27017 -d mongo:6

# Option 2: MongoDB local installation
# Pastikan MongoDB service running
```

### 4. Import Dataset

```bash
# Taruh file CSV di folder data/
# Lalu jalankan import script
npm run import:csv

# Atau manual dengan path:
npm run import:csv -- /path/to/your/dataset.csv
```

### 5. Setup Database Indexes

```bash
npm run setup:indexes
```

### 6. Start Development Server

```bash
npm run dev
```

Server akan running di http://localhost:4000

## API Endpoints

### Health Check

- `GET /api/health` - Server health status

### Records

- `GET /api/v1/records` - List records (paginated, filterable)
  - Query params: `page`, `limit`, `gender`, `locationType`, `digitalInterest`, `search`, `sortBy`, `sortOrder`

### Statistics

- `GET /api/v1/stats/gender` - Gender distribution
- `GET /api/v1/stats/location` - Location type distribution
- `GET /api/v1/stats/interest` - Digital interest distribution
- `GET /api/v1/stats/dashboard` - Comprehensive dashboard stats

### Documentation

- `GET /docs` - Swagger UI documentation

## Project Structure

```
src/
├── controllers/     # Route handlers
├── models/         # Mongoose schemas
├── routes/         # Express routes
├── services/       # Business logic
├── middleware/     # Custom middleware
├── utils/          # Utilities (pagination, validation, etc)
├── scripts/        # Utility scripts (import, indexes)
└── server.ts       # Main server file
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run import:csv` - Import CSV data
- `npm run setup:indexes` - Setup database indexes

## Environment Variables

```bash
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://localhost:27017/higo
ALLOWED_ORIGINS=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```
