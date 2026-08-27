import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';

dotenv.config();

// Local development only.
// On Vercel, api/index.js is the serverless entry point and starts the app.
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000;
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default app;
