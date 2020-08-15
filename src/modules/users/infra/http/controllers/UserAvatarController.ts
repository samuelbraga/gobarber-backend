import { Request, Response } from 'express';
import { container } from 'tsyringe';
import HttpStatus from 'http-status-codes';

import UploadUserAvatarService from '@modules/users/services/UploadUserAvatarService';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const uploadUserAvatarService = container.resolve(UploadUserAvatarService);

    const user = await uploadUserAvatarService.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;

    return response.status(HttpStatus.OK).json(user);
  }
}
