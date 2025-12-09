// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Exclude Node.js-only packages from bundling
config.resolver.blockList = [
  // Block undici (Node.js fetch implementation) - React Native has its own fetch
  /node_modules[\/\\]undici[\/\\].*/,
];

module.exports = config;

