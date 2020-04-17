import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';

import ErrorHandler from './middleware/ErrorHandler';
import routes from './routes';

import uploadConfig from './config/multer';

import './database';

const app = express();

app.use(express.json());

app.use('/files', express.static(uploadConfig.directory));

app.use(routes);

app.use(ErrorHandler);

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('App is running!');
});
