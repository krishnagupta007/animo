import app from './app.js';
import { connectToMongo } from './db.js';

const PORT = Number(process.env.PORT) || 5001;
const HOST = process.env.HOST || '0.0.0.0';

try {
  await connectToMongo();
  const address = await app.listen({ port: PORT, host: HOST });
  console.log(`Local server listening on ${address}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
