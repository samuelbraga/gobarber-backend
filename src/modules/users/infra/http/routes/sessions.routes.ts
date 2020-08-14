import { Router } from 'express';
import 'express-async-errors';
import HttpStatus from 'http-status-codes';

import UserRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import CreateSessionService from '@modules/users/services/CreateSessionService';

const sessionsRouter = Router();
const userRepository = new UserRepository();

sessionsRouter.post('/', async (request, response) => {
  const createSessionService = new CreateSessionService(userRepository);

  const { email, password } = request.body;

  const { user, token } = await createSessionService.execute({
    email,
    password,
  });

  delete user.password;

  return response.status(HttpStatus.CREATED).json({ user, token });
});

export default sessionsRouter;
