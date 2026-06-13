import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from './app.js';
import { connectToMongo } from './db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Ensure database connection
    await connectToMongo();
    
    // Ensure Fastify app is ready
    await app.ready();
    
    // Pass the request to Fastify
    app.server.emit('request', req, res);
  } catch (err) {
    console.error('Serverless function error:', err);
    if (!res.writableEnded) {
      res.status(500).send({ 
        error: 'Internal Server Error', 
        message: err instanceof Error ? err.message : 'An unexpected error occurred in the serverless function.' 
      });
    }
  }
}
