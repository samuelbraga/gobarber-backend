import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateUserProfileService from './UpdateUserProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateUserProfileService: UpdateUserProfileService;

describe('UploadUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateUserProfileService = new UpdateUserProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Foo Bar',
      email: 'foo.bar@example.com',
      password: '123456',
    });

    const updatedUser = await updateUserProfileService.execute({
      user_id: user.id,
      name: 'Bar Foo',
      email: 'bar.foo@example.com',
    });

    expect(updatedUser.name).toBe('Bar Foo');
    expect(updatedUser.email).toBe('bar.foo@example.com');
  });

  it('should not be able to update profile non-existing user', async () => {
    await expect(
      updateUserProfileService.execute({
        user_id: 'non-existing',
        name: 'Foo Bar',
        email: 'foo.bar@example.com',
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to change email for an existing user email', async () => {
    await fakeUsersRepository.create({
      name: 'Foo Bar',
      email: 'bar.foo@example.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Foo Bar',
      email: 'foo.bar@example.com',
      password: '123456',
    });

    await expect(
      updateUserProfileService.execute({
        user_id: user.id,
        name: 'Bar Foo',
        email: 'bar.foo@example.com',
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Foo Bar',
      email: 'bar.foo@example.com',
      password: '123456',
    });

    const updatedUser = await updateUserProfileService.execute({
      user_id: user.id,
      name: 'Foo Bar',
      email: 'foo.bar@example.com',
      old_password: '123456',
      password: '654321',
    });

    expect(updatedUser.password).toBe('654321');
  });

  it('should not be able to update the password without pass old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Foo Bar',
      email: 'bar.foo@example.com',
      password: '123456',
    });

    await expect(
      updateUserProfileService.execute({
        user_id: user.id,
        name: 'Foo Bar',
        email: 'foo.bar@example.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to update the password wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Foo Bar',
      email: 'bar.foo@example.com',
      password: '123456',
    });

    await expect(
      updateUserProfileService.execute({
        user_id: user.id,
        name: 'Foo Bar',
        email: 'foo.bar@example.com',
        old_password: 'wrong_password',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
