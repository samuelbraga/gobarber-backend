import path from 'path';
import fs from 'fs';
import { getCustomRepository } from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';
import UsersRepository from '@modules/users/repositories/UsersRepository';

import uploadConfig from '@config/multer';

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UploadUserAvatarService {
  private userRepository = getCustomRepository(UsersRepository);

  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const user = await this.userRepository.findUserById(user_id);

    await this.deleteOldAvatar(user);

    user.avatar = avatarFilename;

    await this.userRepository.save(user);

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
