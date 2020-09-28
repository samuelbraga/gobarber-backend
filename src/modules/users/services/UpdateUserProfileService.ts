import { injectable, inject } from 'tsyringe';
import HttpStatus from 'http-status-codes';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/modules/IHashProvider';

import ExceptionBase from '@shared/exceptions/ExceptionBase';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateUserProfileService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('HashProvider')
    private readonly hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    old_password,
    password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findUserById(user_id);

    if (!user) {
      throw new ExceptionBase(HttpStatus.BAD_REQUEST, 'User does not exists');
    }

    await this.CheckEmailExists(email, user_id);

    if (password) {
      await this.CheckOldPassword(user, old_password);
      user.password = await this.hashProvider.generateHash(password);
    }

    if (name) user.name = name;
    if (email) user.email = email;

    return this.usersRepository.save(user);
  }

  private async CheckEmailExists(
    email: string,
    user_id: string,
  ): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (user && user.id !== user_id) {
      throw new ExceptionBase(HttpStatus.BAD_REQUEST, 'Email already exists');
    }
  }

  private async CheckOldPassword(
    user: User,
    old_password: string | undefined,
  ): Promise<void> {
    if (!old_password) {
      throw new ExceptionBase(
        HttpStatus.BAD_REQUEST,
        'Old password can not is empty',
      );
    }

    const checkPassword = await this.hashProvider.compareHash(
      old_password,
      user.password,
    );

    if (!checkPassword) {
      throw new ExceptionBase(HttpStatus.BAD_REQUEST, 'Wrong old password');
    }
  }
}

export default UpdateUserProfileService;
