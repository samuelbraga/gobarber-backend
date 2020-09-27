import 'express-async-errors';
import { Router } from 'express';

import AppointmentsController from '@modules/appointments/infra/http/controller/AppointmentsController';
import ProviderAppointmentsController from '@modules/appointments/infra/http/controller/ProviderAppointmentsController';
import EnsureAuthenticated from '@modules/users/infra/http/middleware/EnsureAuthenticated';

const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

const appointmentsRouter = Router();

appointmentsRouter.use(EnsureAuthenticated);

appointmentsRouter.post('/', appointmentsController.create);
appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;
