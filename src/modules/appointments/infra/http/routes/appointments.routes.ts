import { Router } from 'express';
import 'express-async-errors';
import { parseISO } from 'date-fns';
import HttpStatus from 'http-status-codes';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import ListAppointmentService from '@modules/appointments/services/ListAppointmentService';
import EnsureAuthenticated from '@modules/users/infra/http/middleware/EnsureAuthenticated';

const appointmentsRouter = Router();
appointmentsRouter.use(EnsureAuthenticated);

appointmentsRouter.get('/', async (request, response) => {
  const listAppointmentService = new ListAppointmentService();
  const appointments = await listAppointmentService.execute();
  return response.status(HttpStatus.OK).json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
  const createAppointment = new CreateAppointmentService();

  const { provider_id, date } = request.body;
  const parsedDate = parseISO(date);

  const appointment = await createAppointment.execute({
    provider_id,
    date: parsedDate,
  });

  return response.status(HttpStatus.CREATED).json(appointment);
});

export default appointmentsRouter;
