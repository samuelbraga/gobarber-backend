import { Request, Response } from 'express';
import { container } from 'tsyringe';
import HttpStatus from 'http-status-codes';

import UpdateUserProfileService from '@modules/users/services/UpdateUserProfileService';
import ShowUserProfileService from '@modules/users/services/ShowUserProfileService';

export default class UsersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const showUserProfileService = container.resolve(ShowUserProfileService);

    const user_id = request.user.id;

    const user = await showUserProfileService.execute({ user_id });

    delete user.password;

    return response.status(HttpStatus.OK).json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const updateUserProfileService = container.resolve(
      UpdateUserProfileService,
    );

    const user_id = request.user.id;
    const { name, email, old_password, password } = request.body;

    const user = await updateUserProfileService.execute({
      user_id,
      name,
      email,
      old_password,
      password,
    });

    delete user.password;

    return response.status(HttpStatus.OK).json(user);
  }
}
