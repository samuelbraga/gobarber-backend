import { getRepository, Repository } from 'typeorm';
import HttpStatus from 'http-status-codes';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ExceptionBase from '@shared/exceptions/ExceptionBase';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne({ where: { email } });
    return findUser;
  }

  public async findUserById(user_id: string): Promise<User> {
    const user = await this.ormRepository.findOne(user_id);

    if (!user) {
      throw new ExceptionBase(HttpStatus.BAD_REQUEST, 'User not found');
    }

    return user;
  }

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = await this.ormRepository.create({
      name,
      email,
      password,
    });

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<void> {
    await this.ormRepository.save(user);
  }
}

export default UsersRepository;
