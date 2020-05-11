import { Router } from 'express';
import 'express-async-errors';
import HttpStatus from 'http-status-codes';

import CreateSessionService from '@modules/users/services/CreateSessionService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const createSessionService = new CreateSessionService();

  const { email, password } = request.body;

  const { user, token } = await createSessionService.execute({
    email,
    password,
  });

  delete user.password;

  return response.status(HttpStatus.CREATED).json({ user, token });
});

export default sessionsRouter;
