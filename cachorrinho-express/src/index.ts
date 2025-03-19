import 'dotenv/config';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import routes from './routes';
import { Container } from './container';

const app = express();
const MAX_RETRIES = 10;
const RETRY_DELAY = 5000;

app.use(
  cors({
    origin: [
      'http://localhost', 
      'http://localhost:3000',
      'http://localhost:80',
      'http://127.0.0.1',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:80',
      'http://dashboard:3000', 
      'http://localhost:5173', 
      'http://127.0.0.1:5173',
      'http://nginx',
      'http://nginx:80',
      'https://localhost',
      'https://127.0.0.1'
    ],
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
      console.log(`Retrying connection in ${RETRY_DELAY/1000} seconds... (${retries} attempts left)`);
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
