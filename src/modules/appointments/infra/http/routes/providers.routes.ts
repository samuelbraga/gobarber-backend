import 'express-async-errors';
import { Router } from 'express';

import ProvidersController from '@modules/appointments/infra/http/controller/ProvidersController';
import ProviderMonthAvailabilitController from '@modules/appointments/infra/http/controller/ProviderMonthAvailabilitController';
import ProviderDayAvailabilitController from '@modules/appointments/infra/http/controller/ProviderDayAvailabilitController';
import EnsureAuthenticated from '@modules/users/infra/http/middleware/EnsureAuthenticated';

const providersController = new ProvidersController();
const providerMonthAvailabilitController = new ProviderMonthAvailabilitController();
const providerDayAvailabilitController = new ProviderDayAvailabilitController();

const providersRouter = Router();

providersRouter.use(EnsureAuthenticated);

providersRouter.get('/', providersController.index);
providersRouter.get(
  '/:provider_id/month-availability',
  providerMonthAvailabilitController.index,
);
providersRouter.get(
  '/:provider_id/day-availability',
  providerDayAvailabilitController.index,
);

export default providersRouter;
