import { Router } from 'express';
import 'express-async-errors';
import multer from 'multer';
import HttpStatus from 'http-status-codes';

import UserRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import UploadUserAvatarService from '@modules/users/services/UploadUserAvatarService';
import EnsureAuthenticated from '@modules/users/infra/http/middleware/EnsureAuthenticated';
import uploadConfig from '@config/multer';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  const userRepository = new UserRepository();
  const createUserService = new CreateUserService(userRepository);

  const { name, email, password } = request.body;

  const user = await createUserService.execute({ name, email, password });

  delete user.password;

  return response.status(HttpStatus.CREATED).json(user);
});

usersRouter.patch(
  '/avatar',
  EnsureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const userRepository = new UserRepository();
    const uploadUserAvatarService = new UploadUserAvatarService(userRepository);

    const user = await uploadUserAvatarService.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;

    return response.status(HttpStatus.OK).json(user);
  },
);

export default usersRouter;
