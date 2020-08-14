import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import HttpStatus from 'http-status-codes';

import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';

import authConfig from '@config/auth';
import ExceptionBase from '@shared/exceptions/ExceptionBase';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

class CreateSessionService {
  constructor(private readonly userRepository: IUserRepository) {}

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
    const user = await this.userRepository.findByEmail(email);

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
    const passwordMatched = await compare(password, userPassword);

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
