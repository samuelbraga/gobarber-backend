import { injectable, inject } from 'tsyringe';
import HttpStatus from 'http-status-codes';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IReponseUserDTO from '@modules/users/dtos/IReponseUserDTO';

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

  public async execute({ user_id }: IRequest): Promise<IReponseUserDTO> {
    const user = await this.usersRepository.findUserById(user_id);

    if (!user) {
      throw new ExceptionBase(HttpStatus.BAD_REQUEST, 'User does not exists');
    }

    return user;
  }
}

export default ShowUserProfileService;
