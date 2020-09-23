import { injectable, inject } from 'tsyringe';
import HttpStatus from 'http-status-codes';
import { isAfter, addHours } from 'date-fns';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IHashProvider from '@modules/users/providers/HashProvider/modules/IHashProvider';

import ExceptionBase from '@shared/exceptions/ExceptionBase';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private readonly userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private readonly hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new ExceptionBase(
        HttpStatus.BAD_REQUEST,
        'User token does not exists',
      );
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new ExceptionBase(HttpStatus.BAD_REQUEST, 'Token expired');
    }

    const user = await this.usersRepository.findUserById(userToken.user_id);

    if (!user) {
      throw new ExceptionBase(HttpStatus.BAD_REQUEST, 'User does not exists');
    }

    user.password = await this.hashProvider.generateHash(password);
    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
