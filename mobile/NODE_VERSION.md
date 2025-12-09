# Node.js Version Requirements

Expo SDK 54 requires **Node.js 20.10.0 or higher** (or Node.js 22+).

## Current Issues

1. **ReadableStream error**: Expo CLI's `undici` dependency needs `ReadableStream` which should be available in Node 20.10.0+
2. **availableParallelism error**: Metro config needs `os.availableParallelism()` which requires Node 20.10.0+

## Solution

**Upgrade to Node.js 22 LTS:**

```bash
# Install Node.js 22
nvm install 22

# Use it
nvm use 22

# Make it default (so it persists)
nvm alias default 22

# Verify
node --version  # Should show v22.x.x
```

Then restart Expo:
```bash
cd mobile
npm start
```

## Alternative: Use Node.js 20.10.0+

If you prefer Node 20:
```bash
nvm install 20.10.0
nvm use 20.10.0
nvm alias default 20.10.0
```

## Check Your Current Version

```bash
node --version
```

If it shows v16.x.x or v20.9.0 or lower, you need to upgrade.



