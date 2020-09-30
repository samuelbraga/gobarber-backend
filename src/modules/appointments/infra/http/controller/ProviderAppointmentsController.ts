import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import HttpStatus from 'http-status-codes';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

export default class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listProviderAppointmentsService = container.resolve(
      ListProviderAppointmentsService,
    );

    const provider_id = request.user.id;
    const { day, month, year } = request.query;

    const appointments = await listProviderAppointmentsService.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    return response.status(HttpStatus.OK).json(classToClass(appointments));
  }
}
