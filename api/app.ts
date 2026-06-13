/* eslint-disable */
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import compress from '@fastify/compress';
import { journalRoutes } from './routes/journal.js';

const app = Fastify({
  logger: true,
});

// Register Compression for performance
await app.register(compress);

// Register Helmet for enterprise-grade security headers
await app.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "https://openrouter.ai"],
    },
  },
});

// Register CORS with safe defaults
await app.register(cors, {
  origin: true,
  credentials: true,
});

// Register Rate Limiting to prevent API abuse (Enterprise Requirement)
await app.register(rateLimit, {
  max: 60,
  timeWindow: '1 minute',
  errorResponseBuilder: (request, context) => ({
    statusCode: 429,
    error: 'Too Many Requests',
    message: `Rate limit exceeded. Please try again in ${context.after}.`,
  }),
});

// Register journal API routes
await app.register(journalRoutes);

// Health check endpoint
app.get('/health', async (request, reply) => {
  return { status: 'OK', timestamp: new Date().toISOString() };
});

// Set global error handler
app.setErrorHandler((error, request, reply) => {
  request.log.error(error);
  const err = error as any;

  if (err.statusCode === 429) {
    return reply.status(429).send({
      error: 'Too Many Requests',
      message: err.message,
    });
  }

  return reply.status(err.statusCode || 500).send({
    error: err.statusCode === 400 ? 'Bad Request' : 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.',
  });
});

export default app;
