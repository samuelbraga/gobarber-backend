import { Router } from 'express';
import 'express-async-errors';
import HttpStatus from 'http-status-codes';

import CreateUserService from '../service/user/CreateUserService';

const usersRouter = Router();

usersRouter.post('/', async (request, response) => {
  const createUserService = new CreateUserService();

  const { name, email, password } = request.body;

  const user = await createUserService.execute({ name, email, password });

  delete user.password;

  return response.status(HttpStatus.CREATED).json(user);
});

export default usersRouter;
