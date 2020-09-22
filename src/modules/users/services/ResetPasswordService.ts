import { injectable, inject } from 'tsyringe';
import HttpStatus from 'http-status-codes';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

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

    @inject('IUserTokensRepository')
    private readonly userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new ExceptionBase(
        HttpStatus.BAD_REQUEST,
        'User token does not exists',
      );
    }

    const user = await this.usersRepository.findUserById(userToken.user_id);

    if (!user) {
      throw new ExceptionBase(HttpStatus.BAD_REQUEST, 'User does not exists');
    }

    user.password = password;
    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
