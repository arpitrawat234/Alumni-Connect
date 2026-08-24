# AlumniConnect 🎓

Smart Alumni Guidance & Mentorship Platform.

## Architecture

```
AlumniConnect/
│
├── client/                 # React Frontend (Vite + React Router)
│   ├── src/
│   │   ├── components/     # UI components (Navbar, AlumniCard, BackendStatus, etc.)
│   │   ├── pages/          # Landing, Dashboard, Alumni Directory, Dynamic Profiles, etc.
│   │   └── data/           # Mock alumni data
│   └── package.json
│
├── server/                 # NestJS Backend API
│   ├── src/
│   │   ├── health/         # Health check module (GET /api/health)
│   │   ├── test-records/   # MongoDB verification module (POST/GET /api/test-records)
│   │   ├── app.module.ts   # Main app module (Config & Mongoose)
│   │   └── main.ts         # Bootstrap (/api prefix, CORS, validation pipe)
│   ├── .env.example        # Environment variables template
│   └── package.json
│
├── .gitignore
└── README.md
```

## Phase 2: Backend Foundation

### Features Implemented
- **NestJS Server**: Decoupled, modular architecture with TypeScript.
- **Global API Prefix**: All endpoints scoped under `/api/...`.
- **CORS Configured**: Allows cross-origin requests from `http://localhost:5173`.
- **Global Request Validation**: Enforced via `ValidationPipe` with `class-validator` & `class-transformer`.
- **Health Check Endpoint**: `GET /api/health` returning live status and timestamps.
- **MongoDB + Mongoose Integration**: Async configuration connected via `@nestjs/config` & `@nestjs/mongoose`.
- **Verification Module**: `test-records` demonstrating schema validation, DTOs, and error handling.
- **Fullstack React Connection**: Live backend status widget integrated directly into the React Dashboard.

---

## Getting Started

### 1. Run Backend Server (NestJS)

```bash
cd server
npm install
npm run start:dev
```
- API Base: `http://localhost:5000/api`
- Health Check: `http://localhost:5000/api/health`

### 2. Run Frontend Client (React)

```bash
cd client
npm install
npm run dev
```
- Client URL: `http://localhost:5173`

---

## Environment Variables (`server/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Backend listening port | `5000` |
| `MONGODB_URI` | MongoDB Atlas / Local connection string | `mongodb+srv://<user>:<password>@cluster.mongodb.net/alumniconnect` |
| `CLIENT_ORIGIN` | Allowed CORS frontend origin | `http://localhost:5173` |

---

## API Endpoints (Phase 2)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check endpoint |
| `POST` | `/api/test-records` | Create test record (Validates `{ name: string }`) |
| `GET` | `/api/test-records` | Retrieve all test records |
| `GET` | `/api/test-records/:id` | Retrieve single test record by ID (404 on missing) |
