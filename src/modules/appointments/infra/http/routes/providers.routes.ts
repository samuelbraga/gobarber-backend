import 'express-async-errors';
import { Router } from 'express';

import ProvidersController from '@modules/appointments/infra/http/controller/ProvidersController';
import EnsureAuthenticated from '@modules/users/infra/http/middleware/EnsureAuthenticated';

const providersController = new ProvidersController();

const providersRouter = Router();

providersRouter.use(EnsureAuthenticated);

providersRouter.get('/', providersController.index);

export default providersRouter;
