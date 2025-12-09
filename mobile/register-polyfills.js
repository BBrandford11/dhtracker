// Register ReadableStream polyfill for Node.js before Expo CLI loads
// Ensure ReadableStream is available globally for undici

// First, try to use Node's built-in ReadableStream (Node 18+)
try {
  const streamWeb = require('stream/web');
  if (streamWeb.ReadableStream) {
    global.ReadableStream = streamWeb.ReadableStream;
    global.WritableStream = streamWeb.WritableStream || global.WritableStream;
    global.TransformStream = streamWeb.TransformStream || global.TransformStream;
  }
} catch (e) {
  // stream/web might not be available in all Node versions
}

// If still not available, use polyfill
if (typeof global.ReadableStream === 'undefined') {
  try {
    const { ReadableStream, WritableStream, TransformStream } = require('web-streams-polyfill/ponyfill/es2018');
    global.ReadableStream = ReadableStream;
    global.WritableStream = WritableStream || global.WritableStream;
    global.TransformStream = TransformStream || global.TransformStream;
  } catch (e2) {
    // If polyfill also fails, create a minimal stub
    console.warn('Could not load ReadableStream polyfill, using stub');
  }
}

// Also ensure it's available on globalThis (for some modules)
if (typeof globalThis !== 'undefined' && typeof globalThis.ReadableStream === 'undefined') {
  globalThis.ReadableStream = global.ReadableStream;
  globalThis.WritableStream = global.WritableStream;
  globalThis.TransformStream = global.TransformStream;
}

