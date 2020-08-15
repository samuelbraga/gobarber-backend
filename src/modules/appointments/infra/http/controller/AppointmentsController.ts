import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';
import HttpStatus from 'http-status-codes';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import ListAppointmentService from '@modules/appointments/services/ListAppointmentService';

export default class AppointmentsController {
  public async list(request: Request, response: Response): Promise<Response> {
    const listAppointmentService = container.resolve(ListAppointmentService);
    const appointments = await listAppointmentService.execute();
    return response.status(HttpStatus.OK).json(appointments);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const createAppointment = container.resolve(CreateAppointmentService);

    const { provider_id, date } = request.body;
    const parsedDate = parseISO(date);

    const appointment = await createAppointment.execute({
      provider_id,
      date: parsedDate,
    });

    return response.status(HttpStatus.CREATED).json(appointment);
  }
}
