import 'express-async-errors';
import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import AppointmentsController from '@modules/appointments/infra/http/controller/AppointmentsController';
import ProviderAppointmentsController from '@modules/appointments/infra/http/controller/ProviderAppointmentsController';
import EnsureAuthenticated from '@modules/users/infra/http/middleware/EnsureAuthenticated';

const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

const appointmentsRouter = Router();

appointmentsRouter.use(EnsureAuthenticated);

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date().required(),
    },
  }),
  appointmentsController.create,
);

appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;
