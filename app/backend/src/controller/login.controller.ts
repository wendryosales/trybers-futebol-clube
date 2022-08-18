import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import LoginService from '../service/login.service';

class LoginController {
  private _loginService: LoginService;

  constructor(loginService: LoginService = new LoginService()) {
    this._loginService = loginService;
  }

  public async login(req: Request, res: Response): Promise<Response> {
    await this._loginService.validateBody(req.body);
    const token = await this._loginService.login();
    return res.status(StatusCodes.OK).json({ token });
  }
}

export default LoginController;
