import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatarService: UpdateUserAvatarService;

describe('UploadUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to create a new user avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Foo Bar',
      email: 'foo.bar@example.com',
      password: '123456',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(user.avatar).toEqual('avatar.jpg');
  });

  it('should be able to update a user avatar', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'Foo Bar',
      email: 'foo.bar@example.com',
      password: '123456',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar_1.jpg',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar_2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar_1.jpg');
    expect(user.avatar).toEqual('avatar_2.jpg');
  });

  it('should not be able to update a user avatar for unauthorized user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Foo Bar',
      email: 'foo.bar@example.com',
      password: '123456',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    await expect(
      updateUserAvatarService.execute({
        user_id: 'invalid_id',
        avatarFilename: 'avatar_2.jpg',
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
