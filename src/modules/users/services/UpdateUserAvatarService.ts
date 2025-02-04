import { injectable, inject } from 'tsyringe';
import HttpStatus from 'http-status-codes';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

import ExceptionBase from '@shared/exceptions/ExceptionBase';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private readonly storageProvider: IStorageProvider,
  ) {}

  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    const user = await this.usersRepository.findUserById(user_id);

    if (!user) {
      throw new ExceptionBase(
        HttpStatus.UNAUTHORIZED,
        'Only auyhenticated users can change avatar',
      );
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    await this.storageProvider.saveFile(avatarFilename);

    user.avatar = avatarFilename;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
