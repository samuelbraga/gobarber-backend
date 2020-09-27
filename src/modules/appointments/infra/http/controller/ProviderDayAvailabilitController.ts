import { Request, Response } from 'express';
import { container } from 'tsyringe';
import HttpStatus from 'http-status-codes';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilitController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listProviderDayAvailabilityService = container.resolve(
      ListProviderDayAvailabilityService,
    );

    const { provider_id } = request.params;
    const { day, month, year } = request.body;

    const availabilityDay = await listProviderDayAvailabilityService.execute({
      provider_id,
      day,
      month,
      year,
    });

    return response.status(HttpStatus.OK).json(availabilityDay);
  }
}
