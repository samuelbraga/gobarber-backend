import UserTokens from '@modules/users/infra/typeorm/entities/UserTokens';

export default interface IUsersRepository {
  generate(user_id: string): Promise<UserTokens>;
  findByToken(token: string): Promise<UserTokens | undefined>;
}
