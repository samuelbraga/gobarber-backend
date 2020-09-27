import { Request, Response } from 'express';
import { container } from 'tsyringe';
import HttpStatus from 'http-status-codes';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilitController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listProviderMonthAvailabilityService = container.resolve(
      ListProviderMonthAvailabilityService,
    );

    const { provider_id } = request.params;
    const { month, year } = request.body;

    const availabilityMonth = await listProviderMonthAvailabilityService.execute(
      {
        provider_id,
        month,
        year,
      },
    );

    return response.status(HttpStatus.OK).json(availabilityMonth);
  }
}
