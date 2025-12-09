# Quick Start - View Web & Mobile Apps

## Step 1: Start the Backend (Required First!)

The backend API must be running for both web and mobile to work.

```bash
# Navigate to backend
cd backend

# Install dependencies (first time only)
npm install

# Create .env file if it doesn't exist
# Copy the example and update with your database credentials
cp .env.example .env

# Edit .env with your PostgreSQL credentials:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=dhtracker
# DB_USER=postgres
# DB_PASSWORD=your_password

# Start the backend server
npm run dev
```

You should see: `Server running on port 3001`

**Keep this terminal open!**

---

## Step 2: View the Web Dashboard

Open a **new terminal window**:

```bash
# Navigate to web folder
cd web

# Install dependencies (first time only)
npm install

# Start the web server
npm run dev
```

You should see: `Ready on http://localhost:3000`

**Open your browser and go to:** http://localhost:3000

You'll see:
- A header with "DHTracker"
- Tabs for "Spots" and "Leaderboard"
- Browse spots and view leaderboards (read-only)

---

## Step 3: View the Mobile App

Open **another new terminal window**:

```bash
# Navigate to mobile folder
cd mobile

# Install dependencies (first time only)
npm install

# Start Expo
npm start
```

You'll see:
- A QR code in the terminal
- Options to press `i` for iOS simulator or `a` for Android emulator

### Option A: Use Expo Go on Your Phone (Easiest)
1. Install **Expo Go** app from App Store (iOS) or Play Store (Android)
2. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app
3. The app will load on your phone

### Option B: Use Simulator/Emulator
- **iOS**: Press `i` (requires Xcode installed)
- **Android**: Press `a` (requires Android Studio installed)

### Option C: View in Browser
- Press `w` to open in web browser (limited functionality)

---

## What You'll See

### Web Dashboard (http://localhost:3000)
- **Spots Tab**: Browse all spots created by users
- **Leaderboard Tab**: View top riders by runs, distance, etc.
- No login required - read-only

### Mobile App
- **Login Screen**: Demo login buttons (Google/Facebook)
- **Dashboard**: Your stats overview
- **Spots**: Browse and create spots
- **Add Run**: Log your runs
- **Stats**: Personal statistics
- **Leaderboard**: Global rankings
- **Profile**: Manage your profile settings

---

## Troubleshooting

### Backend won't start
- Make sure PostgreSQL is running
- Check your `.env` file has correct database credentials
- Verify database exists: `psql -l | grep dhtracker`

### Web shows "Failed to fetch"
- Make sure backend is running on port 3001
- Check browser console for errors

### Mobile can't connect
- Make sure backend is running
- For physical devices: Use your computer's IP address instead of `localhost`
  - Find IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
  - Update `EXPO_PUBLIC_API_URL` in mobile `.env` to `http://YOUR_IP:3001/api`

### Port already in use
- Backend: Change `PORT` in `backend/.env`
- Web: Change port in `web/package.json` scripts or use `npm run dev -- -p 3001`

---

## Quick Command Reference

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Web
cd web && npm run dev
# Then open: http://localhost:3000

# Terminal 3: Mobile
cd mobile && npm start
# Then scan QR code or press i/a
```




