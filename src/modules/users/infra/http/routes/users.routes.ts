import 'express-async-errors';
import { Router } from 'express';
import multer from 'multer';
import { celebrate, Joi, Segments } from 'celebrate';

import UsersControllers from '@modules/users/infra/http/controllers/UsersController';
import UserAvatarController from '@modules/users/infra/http/controllers/UserAvatarController';
import EnsureAuthenticated from '@modules/users/infra/http/middleware/EnsureAuthenticated';

import uploadConfig from '@config/upload';

const usersRouter = Router();
const upload = multer(uploadConfig.multer);
const usersController = new UsersControllers();
const userAvatarController = new UserAvatarController();

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
);

usersRouter.patch(
  '/avatar',
  EnsureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
);

export default usersRouter;
