import { Request, Response } from 'express';
import { container } from 'tsyringe';
import HttpStatus from 'http-status-codes';
import { classToClass } from 'class-transformer';

import UpdateUserProfileService from '@modules/users/services/UpdateUserProfileService';
import ShowUserProfileService from '@modules/users/services/ShowUserProfileService';

export default class UserProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const showUserProfileService = container.resolve(ShowUserProfileService);

    const user_id = request.user.id;

    const user = await showUserProfileService.execute({ user_id });

    return response.status(HttpStatus.OK).json(classToClass(user));
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

    return response.status(HttpStatus.OK).json(classToClass(user));
  }
}
