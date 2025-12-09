# DHTracker Setup Guide

Complete setup instructions for the DHTracker application.

## Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** 12+
- **Expo CLI** (for mobile development): `npm install -g expo-cli`

## Quick Start

### 1. Database Setup

```bash
# Create PostgreSQL database
createdb dhtracker

# Or using psql
psql -U postgres
CREATE DATABASE dhtracker;
\q
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Start the server
npm run dev
```

The backend will automatically create the database schema on first run.

### 3. Mobile App Setup

```bash
cd mobile
npm install

# Create .env file (optional, defaults to localhost:3001)
echo "EXPO_PUBLIC_API_URL=http://localhost:3001/api" > .env

# Start Expo
npm start
```

Scan the QR code with Expo Go app or use iOS/Android simulators.

### 4. Web Dashboard Setup

```bash
cd web
npm install

# Create .env.local file (optional)
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local

# Start Next.js
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dhtracker
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this
```

### Mobile (.env)
```
EXPO_PUBLIC_API_URL=http://localhost:3001/api
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
EXPO_PUBLIC_FACEBOOK_APP_ID=your-facebook-app-id
```

### Web (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## OAuth Setup (Production)

For production, you'll need to:

1. **Google OAuth**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs
   - Update `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

2. **Facebook OAuth**:
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app
   - Add Facebook Login product
   - Update `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET`

## Development Workflow

1. Start PostgreSQL
2. Start backend: `cd backend && npm run dev`
3. Start mobile: `cd mobile && npm start` (in another terminal)
4. Start web: `cd web && npm run dev` (optional, in another terminal)

## Testing the API

You can test the API endpoints using curl or Postman:

```bash
# Health check
curl http://localhost:3001/health

# Get spots (no auth required)
curl http://localhost:3001/api/spots

# Get leaderboard
curl http://localhost:3001/api/leaderboard?type=runsThisYear&limit=10
```

## Project Structure

```
dhtracker/
├── backend/          # Express API server
│   ├── src/
│   │   ├── db/      # Database connection and schema
│   │   ├── routes/  # API routes
│   │   └── middleware/ # Auth middleware
│   └── package.json
├── mobile/          # React Native app (Expo)
│   ├── src/
│   │   ├── screens/ # App screens
│   │   ├── services/ # API client
│   │   └── context/ # React context
│   └── package.json
├── web/             # Next.js web dashboard
│   └── src/app/     # Next.js app directory
└── shared/          # Shared TypeScript types
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists: `psql -l | grep dhtracker`

### Mobile App Can't Connect to Backend
- Ensure backend is running on port 3001
- Check `EXPO_PUBLIC_API_URL` in mobile `.env`
- For physical devices, use your computer's IP address instead of `localhost`

### Port Already in Use
- Change `PORT` in backend `.env`
- Update API URLs in mobile and web accordingly

## Next Steps

- Implement proper OAuth flows
- Add error handling and validation
- Set up production database
- Configure CI/CD
- Add unit and integration tests




