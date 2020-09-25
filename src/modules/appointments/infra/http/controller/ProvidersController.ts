import { Request, Response } from 'express';
import { container } from 'tsyringe';
import HttpStatus from 'http-status-codes';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listProvidersService = container.resolve(ListProvidersService);

    const user_id = request.user.id;

    const providers = await listProvidersService.execute({ user_id });

    return response.status(HttpStatus.OK).json(providers);
  }
}
