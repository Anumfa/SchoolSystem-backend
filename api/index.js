// Vercel serverless entry point (backend project).
// Local dev uses backend/server.js — this file is only used by Vercel.
import app from '../app.js';
import connectDB from '../config/db.js';

// Start connecting to MongoDB as soon as the function boots (cached across
// warm invocations). On cold starts the first request waits for the DB.
const dbReady = connectDB();

export default async function handler(req, res) {
  await dbReady;
  return app(req, res);
}
