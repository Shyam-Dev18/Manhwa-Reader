import mongoose from "mongoose";

/**
 * MongoDB connection singleton for Next.js.
 *
 * WHY THIS PATTERN:
 * - In development, Next.js hot-reloads modules on every change.
 *   Without caching, each reload creates a NEW connection — quickly
 *   exhausting MongoDB Atlas free-tier's 500-connection limit.
 * - In production (Vercel serverless), each cold start gets its own
 *   module scope. We cache on `globalThis` so warm invocations reuse
 *   the existing connection instead of opening a new one.
 *
 * MEMORY LEAK PREVENTION:
 * - We store the connection promise (not the resolved connection) in
 *   the cache. This ensures concurrent requests during cold start
 *   share a single pending connection instead of racing to create
 *   multiple connections.
 * - `bufferCommands: false` prevents Mongoose from silently queueing
 *   operations when disconnected — fail fast instead of leaking memory.
 */

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Missing MONGODB_URI environment variable. " +
      "Add it to .env.local for development or Vercel environment variables for production."
  );
}

/** Shape of the cached connection stored on globalThis */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/**
 * Extend globalThis to hold our cache.
 * Using `var` is intentional — it declares on globalThis in Node.js.
 */
/* eslint-disable no-var */
declare global {
  var mongooseCache: MongooseCache | undefined;
}
/* eslint-enable no-var */

const cached: MongooseCache = globalThis.mongooseCache ?? {
  conn: null,
  promise: null,
};

// Persist cache on globalThis so it survives hot reloads
globalThis.mongooseCache = cached;

/**
 * Get a cached Mongoose connection (or create one).
 * Safe to call from any server component, API route, or fetcher.
 */
async function dbConnect(): Promise<typeof mongoose> {
  // Return cached connection if it's already established
  if (cached.conn) {
    return cached.conn;
  }

  // If no promise is pending, create one
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      // Disable command buffering — fail fast if disconnected
      bufferCommands: false,
      // Connection pool size (Atlas free tier can handle ~50 concurrent)
      maxPoolSize: 10,
      // Server selection timeout (ms) — fail fast on cold starts
      serverSelectionTimeoutMS: 10_000,
      // Socket timeout (ms)
      socketTimeoutMS: 45_000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI as string, opts)
      .then((m) => {
        console.log("[MongoDB] Connected successfully");
        return m;
      })
      .catch((err) => {
        // Reset promise so next call retries instead of returning
        // a permanently rejected promise
        cached.promise = null;
        throw err;
      });
  }

  // Await the pending (or just-created) promise
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
