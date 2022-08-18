import dotenv = require('dotenv');
import jwt = require('jsonwebtoken');
import { Payload } from '../types/Payload';

dotenv.config();

class AuthService {
  private payload: Payload;
  private secret: string;
  constructor(payload: Payload, secret: string = process.env.JWT_SECRET as string) {
    this.payload = payload;
    this.secret = secret;
  }

  sign(): string {
    return jwt.sign(this.payload, this.secret);
  }

  verify(token: string): string | jwt.JwtPayload {
    return jwt.verify(token, this.secret);
  }
}

export default AuthService;
