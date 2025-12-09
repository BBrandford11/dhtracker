# dhtracker

A lightweight community app for downhill skaters to track runs, log favorite spots, and compare stats with other riders.

## Project Structure

```
dhtracker/
├── backend/          # Express API server
├── mobile/           # React Native app
├── web/              # Web dashboard (read-only)
└── shared/           # Shared types and utilities
```

## Tech Stack

- **Backend**: Node.js, Express, PostgreSQL
- **Mobile**: React Native, Expo
- **Web**: React, Next.js
- **Authentication**: Google OAuth, Facebook OAuth

## Getting Started

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Mobile App Setup
```bash
cd mobile
npm install
npm start
```

### Web Dashboard Setup
```bash
cd web
npm install
npm run dev
```

## Features

### MVP (v1)
- ✅ Sign in (Google/Facebook)
- ✅ Create/edit/delete spots
- ✅ Log runs (manual input)
- ✅ Personal stats dashboard
- ✅ Public/Private profile toggle
- ✅ Global leaderboard
- ✅ Web read-only platform

## Data Model

- **Users**: id, name, email, authProvider, isPublicProfile, createdAt
- **Spots**: id, name, distanceMeters, creatorUserId, createdAt
- **Runs**: id, spotId, userId, numberOfRuns, dateLogged
