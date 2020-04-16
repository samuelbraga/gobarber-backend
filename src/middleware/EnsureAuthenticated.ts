import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import HttpStatus from 'http-status-codes';

import authConfig from '../config/auth';
import ExceptionBase from '../exceptions/ExceptionBase';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new ExceptionBase(HttpStatus.UNAUTHORIZED, 'JWT token is missing');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.secret);

    const { sub } = decoded as TokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new ExceptionBase(HttpStatus.UNAUTHORIZED, 'invalid JWT token');
  }
};
