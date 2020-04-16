import { Router } from 'express';
import 'express-async-errors';
import { parseISO } from 'date-fns';
import HttpStatus from 'http-status-codes';

import EnsureAuthenticated from '../middleware/EnsureAuthenticated';

import CreateAppointmentService from '../service/appointment/CreateAppointmentService';
import ListAppointmentService from '../service/appointment/ListAppointmentService';

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
