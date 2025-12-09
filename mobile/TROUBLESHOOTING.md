# Troubleshooting Mobile App

## Port Already in Use

If you see "Port 8081 is running this app in another window":

```bash
# Kill the process on port 8081
lsof -ti:8081 | xargs kill -9

# Or kill all Expo processes
pkill -f expo

# Then start again
npm start
```

## Certificate Warning

If you see Netskope certificate warnings, they're harmless. To suppress them:

```bash
unset NODE_EXTRA_CA_CERTS SSL_CERT_FILE
npm start
```

Or use the startup script:
```bash
./start.sh
```

## Fetch Failed / Network Error

If you see `TypeError: fetch failed` when starting Expo, this is usually due to:
- Corporate network/proxy blocking Expo API requests
- Network connectivity issues
- SSL certificate problems

**Solution:** The start scripts now include `--offline` flag to skip dependency validation. If you still see this error, you can manually add it:

```bash
npx expo start --clear --offline
```

Note: `--offline` mode skips checking for native module updates but still allows local development.

## Expo Not Starting

1. Clear Expo cache:
```bash
npx expo start --clear
```

2. Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

3. Check for missing assets - if you see errors about missing icon.png or splash.png, they've been removed from app.json. You can add them later if needed.

## QR Code Not Showing

1. Make sure Expo is fully started (wait for the QR code to appear)
2. Check your network - the QR code contains your local IP address
3. Try opening the Expo DevTools in your browser (usually shown in the terminal)
4. For physical devices, make sure your phone and computer are on the same WiFi network

## Can't Connect from Phone

1. Check that backend is running on port 3001
2. Update `EXPO_PUBLIC_API_URL` in `.env` to use your computer's IP address instead of localhost:
   ```
   EXPO_PUBLIC_API_URL=http://YOUR_IP_ADDRESS:3001/api
   ```
   Find your IP: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)




