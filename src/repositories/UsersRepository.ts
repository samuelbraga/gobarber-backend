import { EntityRepository, Repository } from 'typeorm';
import HttpStatus from 'http-status-codes';

import User from '../models/User';
import ExceptionBase from '../exceptions/ExceptionBase';

@EntityRepository(User)
class UsersRepository extends Repository<User> {
  public async findByEmail(email: string): Promise<User | null> {
    const findUser = await this.findOne({ where: { email } });
    return findUser || null;
  }

  public async findUserById(user_id: string): Promise<User> {
    const user = await this.findOne(user_id);

    if (!user) {
      throw new ExceptionBase(HttpStatus.BAD_REQUEST, 'User not found');
    }

    return user;
  }
}

export default UsersRepository;
