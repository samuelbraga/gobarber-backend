import { Router } from 'express';
import 'express-async-errors';
import multer from 'multer';
import HttpStatus from 'http-status-codes';

import CreateUserService from '../service/user/CreateUserService';
import UploadUserAvatarService from '../service/user/UploadUserAvatarService';
import EnsureAuthenticated from '../middleware/EnsureAuthenticated';
import uploadConfig from '../config/multer';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  const createUserService = new CreateUserService();

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
    const uploadUserAvatarService = new UploadUserAvatarService();

    const user = await uploadUserAvatarService.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;

    return response.status(HttpStatus.OK).json(user);
  },
);

export default usersRouter;
