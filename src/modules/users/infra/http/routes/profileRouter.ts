import 'express-async-errors';
import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import UserProfileController from '@modules/users/infra/http/controllers/UserProfileController';
import EnsureAuthenticated from '@modules/users/infra/http/middleware/EnsureAuthenticated';

const profileRouter = Router();
profileRouter.use(EnsureAuthenticated);

const userProfileController = new UserProfileController();

profileRouter.get('/', userProfileController.show);
profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
      old_password: Joi.string(),
    },
  }),
  userProfileController.update,
);

export default profileRouter;
