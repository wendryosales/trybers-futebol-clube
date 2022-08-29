import dotenv = require('dotenv');
import { StatusCodes } from 'http-status-codes';
import jwt = require('jsonwebtoken');
import GenericError from '../error/generic.error';
import { Payload } from '../types/Payload';

dotenv.config();

class AuthService {
  private secret: string;
  constructor(secret: string = process.env.JWT_SECRET as string) {
    this.secret = secret;
  }

  sign(payload: Payload): string {
    return jwt.sign(payload, this.secret);
  }

  verify(token: string): Payload | undefined {
    try {
      return jwt.verify(token, this.secret) as Payload;
    } catch (error) {
      throw new GenericError('Token must be a valid token', StatusCodes.UNAUTHORIZED);
    }
  }
}

export default AuthService;
