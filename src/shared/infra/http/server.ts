import 'dotenv/config';
import 'reflect-metadata';
import '@shared/infra/typeorm';
import '@shared/container';

import express from 'express';
import cors from 'cors';

import uploadConfig from '@config/multer';
import ErrorHandler from '@shared/infra/http/middleware/ErrorHandler';
import routes from '@shared/infra/http/routes';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/files', express.static(uploadConfig.directory));

app.use(routes);

app.use(ErrorHandler);

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('App is running!');
});
