import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';

import routes from './routes';
import ErrorHandler from './middleware/ErrorHandler';
import './database';

const app = express();

app.use(express.json());

app.use(routes);

app.use(ErrorHandler);

app.listen(3333, () => {
  console.log('App is running!');
});
