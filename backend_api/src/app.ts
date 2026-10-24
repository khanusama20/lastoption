import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config/env';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';

const app: Application = express();

// Explicit reverse proxy trust configuration
if (config.trustProxy !== false) {
  app.set('trust proxy', config.trustProxy);
}

// Security HTTP headers
app.use(helmet());

// CORS configuration (Credentials enabled for HttpOnly cookies)
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parsing with secret
app.use(cookieParser(config.cookieSecret));

// API version 1 router
app.use('/api/v1', apiRouter);

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Centralized error handling
app.use(errorHandler);

export default app;
