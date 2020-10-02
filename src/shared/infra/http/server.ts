import 'dotenv/config';
import 'reflect-metadata';
import '@shared/infra/typeorm';
import '@shared/container';
import { errors } from 'celebrate';

import express from 'express';
import cors from 'cors';

import uploadConfig from '@config/upload';
import ErrorHandler from '@shared/infra/http/middleware/ErrorHandler';
import RateLimiter from '@shared/infra/http/middleware/RateLimiter';
import routes from '@shared/infra/http/routes';

const app = express();

app.use(cors());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(RateLimiter);
app.use(express.json());

app.use(routes);

app.use(errors());
app.use(ErrorHandler);

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('App is running!');
});
