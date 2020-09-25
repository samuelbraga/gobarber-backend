import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProvidersService = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to return users providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Foo Bar',
      email: 'foo.bar@example.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    const { id } = await fakeUsersRepository.create({
      name: 'Foo Bar',
      email: 'bar.foo@example.com',
      password: '123456',
    });

    const providers = await listProvidersService.execute({ user_id: id });

    expect(providers).toEqual([user1, user2]);
  });
});
