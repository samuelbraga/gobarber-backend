import { Request, Response, NextFunction } from 'express';

import ExceptionBase from '../exceptions/ExceptionBase';

export default (
  err: Error,
  request: Request,
  response: Response,
  _: NextFunction,
): Response => {
  if (err instanceof ExceptionBase) {
    return response
      .status(err.statusCode)
      .json({ status: 'error', error: err.message });
  }

  return response.status(500).json({ status: 'error', error: err.message });
};
