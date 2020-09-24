import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateSessionService from './CreateSessionService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createSessionService: CreateSessionService;
let createUserService: CreateUserService;

describe('createSession', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createSessionService = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create a new token access for user', async () => {
    const user = await createUserService.execute({
      name: 'Foo Bar',
      email: 'foo.bar@example.com',
      password: '123456',
    });

    const response = await createSessionService.execute({
      email: user.email,
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should be not able to create a new token for invalid password', async () => {
    await createUserService.execute({
      name: 'Foo Bar',
      email: 'foo.bar@example.com',
      password: '123456',
    });

    await expect(
      createSessionService.execute({
        email: 'foo.bar@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should be not able to create a new token for invalid email', async () => {
    await createUserService.execute({
      name: 'Foo Bar',
      email: 'foo.bar@example.com',
      password: '123456',
    });

    await expect(
      createSessionService.execute({
        email: 'invalid.email@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
