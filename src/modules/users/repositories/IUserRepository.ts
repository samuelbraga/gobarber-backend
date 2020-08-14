import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

export default interface IUserRepository {
  findByEmail(email: string): Promise<User | undefined>;
  findUserById(user_id: string): Promise<User>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<void>;
}
