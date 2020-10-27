import { Router } from 'express';

import appointmentsRouter from '@modules/appointments/infra/http/routes/appointmentsRouter';
import providersRouter from '@modules/appointments/infra/http/routes/providersRouter';
import usersRouter from '@modules/users/infra/http/routes/usersRouter';
import sessionsRouter from '@modules/users/infra/http/routes/sessionsRouter';
import passwordRouter from '@modules/users/infra/http/routes/passwordRouter';
import profileRouter from '@modules/users/infra/http/routes/profileRouter';

const routes = Router();

routes.use('/appointments', appointmentsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);
routes.use('/providers', providersRouter);

export default routes;
