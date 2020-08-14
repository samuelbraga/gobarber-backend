import { hash } from 'bcryptjs';
import HttpStatus from 'http-status-codes';

import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';

import ExceptionBase from '@shared/exceptions/ExceptionBase';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    await this.findUserWithSameEmail(email);

    const hashedPassword = await hash(password, 8);

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }

  private async findUserWithSameEmail(email: string): Promise<void> {
    const findUser = await this.userRepository.findByEmail(email);

    if (findUser) {
      throw new ExceptionBase(
        HttpStatus.BAD_REQUEST,
        'Email address already used',
      );
    }
  }
}

export default CreateUserService;
