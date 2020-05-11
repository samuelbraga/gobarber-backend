import { getCustomRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import HttpStatus from 'http-status-codes';

import User from '@modules/users/infra/typeorm/entities/User';
import UsersRepository from '@modules/users/repositories/UsersRepository';

import ExceptionBase from '@shared/exceptions/ExceptionBase';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  private userReposiory = getCustomRepository(UsersRepository);

  public async execute({ name, email, password }: Request): Promise<User> {
    await this.findUserWithSameEmail(email);

    const hashedPassword = await hash(password, 8);

    const user = await this.userReposiory.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.userReposiory.save(user);

    return user;
  }

  private async findUserWithSameEmail(email: string): Promise<void> {
    const findUser = await this.userReposiory.findByEmail(email);

    if (findUser) {
      throw new ExceptionBase(
        HttpStatus.BAD_REQUEST,
        'Email address already used',
      );
    }
  }
}

export default CreateUserService;
