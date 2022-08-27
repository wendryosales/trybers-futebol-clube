import dotenv = require('dotenv');
import jwt = require('jsonwebtoken');
import { Payload } from '../types/Payload';

dotenv.config();

class AuthService {
  private payload: Payload;
  private secret: string;
  constructor(secret: string = process.env.JWT_SECRET as string) {
    this.secret = secret;
  }

  sign(payload: Payload): string {
    return jwt.sign(payload, this.secret);
  }

  verify(token: string): Payload {
    return jwt.verify(token, this.secret) as Payload;
  }
}

export default AuthService;
