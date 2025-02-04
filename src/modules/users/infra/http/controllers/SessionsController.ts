import { Request, Response } from 'express';
import { container } from 'tsyringe';
import HttpStatus from 'http-status-codes';
import { classToClass } from 'class-transformer';

import CreateSessionService from '@modules/users/services/CreateSessionService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const createSessionService = container.resolve(CreateSessionService);

    const { email, password } = request.body;

    const { user, token } = await createSessionService.execute({
      email,
      password,
    });

    return response
      .status(HttpStatus.CREATED)
      .json({ user: classToClass(user), token });
  }
}
