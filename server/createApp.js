// File used for tests

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import createRouter from './routesForTests.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp(db) {
  const app = express();

  // Middlewares
  app.use(express.static('static'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  // Explicitly pass the db to router
  const router = createRouter(db);
  app.use('/api', router);

  return app;
}
