import { injectable, inject } from 'tsyringe';
import HttpStatus from 'http-status-codes';

import IReponseUserDTO from '@modules/users/dtos/IReponseUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/modules/IStorageProvider';

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

    @inject('DiskStorageProvider')
    private readonly storageProvider: IStorageProvider,
  ) {}

  public async execute({
    user_id,
    avatarFilename,
  }: IRequest): Promise<IReponseUserDTO> {
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
