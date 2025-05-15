import 'dotenv/config';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import routes from './routes';
import { Container } from './container';

const app = express();
const MAX_RETRIES = 10;
const RETRY_DELAY = 5000;

const allowedOrigins: (string | RegExp)[] = [
  /^http:\/\/localhost(:[0-9]+)?$/,
  /^http:\/\/127\.0\.0\.1(:[0-9]+)?$/,
  'http://dashboard:3000',
  /^http:\/\/nginx(:[0-9]+)?$/,
  'https://localhost',
  'https://127.0.0.1',
];

app.use(
  cors({
    origin: function (requestOrigin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
      if (!requestOrigin) {
        return callback(null, true);
      }

      if (allowedOrigins.some(pattern => {
        if (typeof pattern === 'string') {
          return pattern === requestOrigin;
        } else if (pattern instanceof RegExp) {
          return pattern.test(requestOrigin);
        }
        return false; 
      })) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }),
);

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

export const prismaClient = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function connectWithRetry(retries: number): Promise<void> {
  try {
    console.log('Attempting to connect to database...');
    await prismaClient.$connect();
    console.log('Database connection established successfully');

    Container.init();
    app.use(routes);

    app.listen(process.env.PORT || 3344, () => {
      console.log(`Server running on port ${process.env.PORT || 3344}`);
    });
  } catch (err) {
    console.error('Failed to connect to database:', err);

    if (retries > 0) {
      console.log(
        `Retrying connection in ${RETRY_DELAY / 1000} seconds... (${retries} attempts left)`,
      );
      setTimeout(() => connectWithRetry(retries - 1), RETRY_DELAY);
    } else {
      console.error('Maximum retry attempts reached. Could not connect to database.');
      process.exit(1);
    }
  }
}

connectWithRetry(MAX_RETRIES);

process.on('SIGTERM', async () => {
  await prismaClient.$disconnect();
  await Container.disconnect();
  process.exit(0);
});
