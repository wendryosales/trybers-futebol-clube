import bcrypt = require('bcryptjs');
import Joi = require('joi');
import User from '../database/models/user.model';
import IUser from '../types/IUser';
import AuthService from './auth.service';

class LoginService {
  public body: IUser;
  private token: string;
  private authService: AuthService;

  public async login({ email, password }: IUser = this.body): Promise<string> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    if (!await bcrypt.compare(password, user.password)) {
      throw new Error('Invalid password');
    }
    this.authService = new AuthService({ stub: user.id });
    this.token = this.authService.sign();
    return this.token;
  }

  public async validateBody(body: IUser): Promise<IUser> {
    const schema = Joi.object({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    });
    const { error, value } = schema.validate(body);

    if (error) {
      throw error;
    }

    this.body = value;
    return this.body;
  }
}

export default LoginService;
