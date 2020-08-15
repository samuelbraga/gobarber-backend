import { hash } from 'bcryptjs';
import { injectable, inject } from 'tsyringe';
import HttpStatus from 'http-status-codes';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import ExceptionBase from '@shared/exceptions/ExceptionBase';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    await this.findUserWithSameEmail(email);

    const hashedPassword = await hash(password, 8);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }

  private async findUserWithSameEmail(email: string): Promise<void> {
    const findUser = await this.usersRepository.findByEmail(email);

    if (findUser) {
      throw new ExceptionBase(
        HttpStatus.BAD_REQUEST,
        'Email address already used',
      );
    }
  }
}

export default CreateUserService;
