# DHTracker Mobile App

React Native mobile app built with Expo.

## Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
EXPO_PUBLIC_API_URL=http://localhost:3001/api
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
EXPO_PUBLIC_FACEBOOK_APP_ID=your-facebook-app-id
```

3. Start the development server:
```bash
npm start
```

**Note:** If you see a Netskope certificate warning (`nscacert_combined.pem`), you can ignore it - it's harmless. Alternatively, use the startup script:
```bash
./start.sh
```

4. Scan the QR code with Expo Go app (iOS/Android) or press `i` for iOS simulator / `a` for Android emulator.

## Features

- Google/Facebook authentication
- Track runs at different spots
- Create and browse spots
- View personal stats
- Global leaderboards
- Public/private profile toggle

## Note

The current OAuth implementation uses a simplified demo flow. For production, implement proper OAuth flows with `expo-auth-session` and configure OAuth providers.

