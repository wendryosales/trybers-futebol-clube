import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import GenericError from './generic.error';

class ErrorHandling {
  private _name = 'GenericError';
  public middleware(
    err: GenericError,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ): Response {
    if (err.name === this._name) {
      return res.status(err.code).json({
        message: err.message,
      });
    }
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
}

export default ErrorHandling;
