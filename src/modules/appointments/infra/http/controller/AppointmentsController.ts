import { Request, Response } from 'express';
import { container } from 'tsyringe';
import HttpStatus from 'http-status-codes';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const createAppointment = container.resolve(CreateAppointmentService);

    const user_id = request.user.id;
    const { provider_id, date } = request.body;

    const appointment = await createAppointment.execute({
      user_id,
      provider_id,
      date,
    });

    return response.status(HttpStatus.CREATED).json(appointment);
  }
}
