import { Request, Response } from 'express';
import { container } from 'tsyringe';
import HttpStatus from 'http-status-codes';

import ResetPasswordService from '@modules/users/services/ResetPasswordService';

export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const resetPasswordService = container.resolve(ResetPasswordService);

    const { token, password } = request.body;

    await resetPasswordService.execute({ token, password });

    return response.status(HttpStatus.NO_CONTENT).json();
  }
}
