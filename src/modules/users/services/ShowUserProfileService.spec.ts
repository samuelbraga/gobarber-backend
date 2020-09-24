import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowUserProfileService from './ShowUserProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showUserProfileService: ShowUserProfileService;

describe('UploadUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showUserProfileService = new ShowUserProfileService(fakeUsersRepository);
  });

  it('should be able to return user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Foo Bar',
      email: 'foo.bar@example.com',
      password: '123456',
    });

    const showUser = await showUserProfileService.execute({ user_id: user.id });

    expect(showUser.name).toBe('Foo Bar');
    expect(showUser.email).toBe('foo.bar@example.com');
  });

  it('should not be able to update profile non-existing user', async () => {
    await expect(
      showUserProfileService.execute({
        user_id: 'non-existing',
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
