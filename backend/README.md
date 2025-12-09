# DHTracker Backend API

Express.js API server for DHTracker.

## Prerequisites

- Node.js 18+
- PostgreSQL 12+

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up PostgreSQL database:
```bash
createdb dhtracker
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your database credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dhtracker
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
```

5. Run the server:
```bash
npm run dev
```

The server will automatically create the database schema on first run.

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with OAuth provider
- `GET /api/auth/me` - Get current user (requires auth)
- `PATCH /api/auth/me` - Update profile (requires auth)

### Spots
- `GET /api/spots` - Get all spots
- `GET /api/spots/:id` - Get single spot
- `POST /api/spots` - Create spot (requires auth)
- `PUT /api/spots/:id` - Update spot (requires auth, creator only)
- `DELETE /api/spots/:id` - Delete spot (requires auth, creator only)

### Runs
- `GET /api/runs/me` - Get user's runs (requires auth)
- `POST /api/runs` - Create run (requires auth)
- `GET /api/runs/me/stats` - Get user stats (requires auth)

### Leaderboard
- `GET /api/leaderboard?type=runsThisYear&limit=100` - Get leaderboard

Leaderboard types: `runsThisYear`, `lifetimeRuns`, `totalDistance`, `totalLaps`




