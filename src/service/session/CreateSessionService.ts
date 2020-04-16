import { getCustomRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import HttpStatus from 'http-status-codes';

import User from '../../models/User';
import UsersRepository from '../../repositories/UsersRepository';

import authConfig from '../../config/auth';
import ExceptionBase from '../../exceptions/ExceptionBase';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class CreateSessionService {
  private userReposiory = getCustomRepository(UsersRepository);

  public async execute({ email, password }: Request): Promise<Response> {
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
    const user = await this.userReposiory.findOne({ where: { email } });

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
