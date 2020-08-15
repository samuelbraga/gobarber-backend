import { injectable, inject } from 'tsyringe';
import path from 'path';
import fs from 'fs';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import uploadConfig from '@config/multer';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UploadUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    const user = await this.usersRepository.findUserById(user_id);

    await this.deleteOldAvatar(user);

    user.avatar = avatarFilename;

    await this.usersRepository.save(user);

    return user;
  }

  private async deleteOldAvatar(user: User): Promise<void> {
    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }
  }
}

export default UploadUserAvatarService;
