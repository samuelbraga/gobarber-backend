import { v4 } from 'uuid';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserTokens from '@modules/users/infra/typeorm/entities/UserTokens';

class FakeUserTokensRepository implements IUserTokensRepository {
  private userTokens: UserTokens[] = [];

  public async generate(user_id: string): Promise<UserTokens> {
    const userToken = new UserTokens();

    Object.assign(userToken, {
      id: v4(),
      token: v4(),
      user_id,
    });

    this.userTokens.push(userToken);

    return userToken;
  }
}

export default FakeUserTokensRepository;
