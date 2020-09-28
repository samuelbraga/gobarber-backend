import { injectable, inject } from 'tsyringe';
import HttpStatus from 'http-status-codes';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import ExceptionBase from '@shared/exceptions/ExceptionBase';

interface IRequest {
  user_id: string;
}

@injectable()
class ShowUserProfileService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User> {
    const user = await this.usersRepository.findUserById(user_id);

    if (!user) {
      throw new ExceptionBase(HttpStatus.BAD_REQUEST, 'User does not exists');
    }

    return user;
  }
}

export default ShowUserProfileService;
