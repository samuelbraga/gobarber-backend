import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUserService.execute({
      name: 'Foo Bar',
      email: 'foo.bar@example.com',
      password: '123456',
    });

    expect(user);
    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with existing email', async () => {
    await createUserService.execute({
      name: 'Foo Bar',
      email: 'foo.bar@example.com',
      password: '123456',
    });

    await expect(
      createUserService.execute({
        name: 'Foo Bar',
        email: 'foo.bar@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
