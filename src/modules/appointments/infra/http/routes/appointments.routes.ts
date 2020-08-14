import 'express-async-errors';
import { Router } from 'express';
import { parseISO } from 'date-fns';
import HttpStatus from 'http-status-codes';

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import ListAppointmentService from '@modules/appointments/services/ListAppointmentService';
import EnsureAuthenticated from '@modules/users/infra/http/middleware/EnsureAuthenticated';

const appointmentsRouter = Router();
const appointmentsRepository = new AppointmentsRepository();

appointmentsRouter.use(EnsureAuthenticated);

appointmentsRouter.get('/', async (request, response) => {
  const listAppointmentService = new ListAppointmentService(
    appointmentsRepository,
  );
  const appointments = await listAppointmentService.execute();
  return response.status(HttpStatus.OK).json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
  const createAppointment = new CreateAppointmentService(
    appointmentsRepository,
  );

  const { provider_id, date } = request.body;
  const parsedDate = parseISO(date);

  const appointment = await createAppointment.execute({
    provider_id,
    date: parsedDate,
  });

  return response.status(HttpStatus.CREATED).json(appointment);
});

export default appointmentsRouter;
