import { Request, Response, NextFunction } from 'express';

interface ErrorBase extends Error {
  statusCode?: number;
}

export default (
  err: ErrorBase,
  request: Request,
  response: Response,
  _: NextFunction,
): Response => {
  if (err.statusCode) {
    return response
      .status(err.statusCode)
      .json({ status: 'error', error: err.message });
  }

  return response.status(500).json({ status: 'error', error: err.message });
};
