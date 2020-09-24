import { Router } from 'express';
import 'express-async-errors';

import UserProfileController from '@modules/users/infra/http/controllers/UserProfileController';
import EnsureAuthenticated from '@modules/users/infra/http/middleware/EnsureAuthenticated';

const profileRouter = Router();
profileRouter.use(EnsureAuthenticated);

const userProfileController = new UserProfileController();

profileRouter.get('/', EnsureAuthenticated, userProfileController.show);
profileRouter.put('/', EnsureAuthenticated, userProfileController.update);

export default profileRouter;
