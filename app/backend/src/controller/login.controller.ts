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

  public async validate(req: Request, res: Response): Promise<Response> {
    const { role } = await this._loginService.validateToken(req.headers.authorization as string);
    return res.status(StatusCodes.OK).json({ role });
  }
}

export default LoginController;
