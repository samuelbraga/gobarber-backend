import { Request, Response } from 'express';
import { container } from 'tsyringe';
import HttpStatus from 'http-status-codes';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

export default class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listProviderAppointmentsService = container.resolve(
      ListProviderAppointmentsService,
    );

    const provider_id = request.user.id;
    const { day, month, year } = request.body;

    const appointment = await listProviderAppointmentsService.execute({
      provider_id,
      day,
      month,
      year,
    });

    return response.status(HttpStatus.OK).json(appointment);
  }
}
