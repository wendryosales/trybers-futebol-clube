import bcrypt = require('bcryptjs');
import Joi = require('joi');
import { StatusCodes } from 'http-status-codes';
import User from '../database/models/user.model';
import GenericError from '../error/generic.error';
import IUser from '../types/IUser';
import AuthService from './auth.service';

class LoginService {
  public body: IUser;
  private token: string;
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public async login({ email, password }: IUser = this.body): Promise<string> {
    const user = await User.findOne({ where: { email } });
    const message = 'Incorrect email or password';
    if (!user) {
      throw new GenericError(message, StatusCodes.UNAUTHORIZED);
    }
    if (!await bcrypt.compare(password, user.password)) {
      throw new GenericError(message, StatusCodes.UNAUTHORIZED);
    }
    this.token = this.authService.sign({ stub: user.id });
    return this.token;
  }

  public async validateBody(body: IUser): Promise<IUser> {
    const schema = Joi.object({
      email: Joi.string().required().email(),
      password: Joi.string().min(6).required(),
    });
    const { error, value } = schema.validate(body);

    if (error) {
      if (error.message.includes('required')) {
        throw new GenericError('All fields must be filled', StatusCodes.BAD_REQUEST);
      }
      throw new GenericError('Incorrect email or password', StatusCodes.UNAUTHORIZED);
    }

    this.body = value;
    return this.body;
  }

  public async validateToken(token: string): Promise<string> {
    const { stub } = this.authService.verify(token);
    if (!stub) {
      throw new GenericError('Invalid token', StatusCodes.UNAUTHORIZED);
    }
    const user = await User.findByPk(stub);
    return user?.role as string;
  }
}

export default LoginService;
