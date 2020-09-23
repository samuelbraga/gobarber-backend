import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';
import HttpStatus from 'http-status-codes';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/modules/IHashProvider';
import IReponseUserDTO from '@modules/users/dtos/IReponseUserDTO';

import authConfig from '@config/auth';
import ExceptionBase from '@shared/exceptions/ExceptionBase';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: IReponseUserDTO;
  token: string;
}

@injectable()
class CreateSessionService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('HashProvider')
    private readonly hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.verifyEmailExist(email);

    await this.verifyPasswordIsCorrect(password, user.password);

    const { secret, expiresIn } = authConfig;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }

  private async verifyEmailExist(email: string): Promise<User> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new ExceptionBase(
        HttpStatus.UNAUTHORIZED,
        'Incorrect email or password',
      );
    }

    return user;
  }

  private async verifyPasswordIsCorrect(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    const passwordMatched = await this.hashProvider.compareHash(
      password,
      userPassword,
    );

    if (!passwordMatched) {
      throw new ExceptionBase(
        HttpStatus.UNAUTHORIZED,
        'Incorrect email or password',
      );
    }

    return passwordMatched;
  }
}

export default CreateSessionService;
