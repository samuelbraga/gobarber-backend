import 'express-async-errors';
import { Router } from 'express';

import AppointmentsController from '@modules/appointments/infra/http/controller/AppointmentsController';
import EnsureAuthenticated from '@modules/users/infra/http/middleware/EnsureAuthenticated';

const appointmentsController = new AppointmentsController();

const appointmentsRouter = Router();

appointmentsRouter.use(EnsureAuthenticated);

appointmentsRouter.get('/', appointmentsController.list);
appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
