import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import GenericError from '../error/generic.error';
import AuthService from '../service/auth.service';
import MatchesService from '../service/matches.service';

class MatchesController {
  private _matchesService: MatchesService;
  private _authService: AuthService;

  constructor(
    matchesService: MatchesService = new MatchesService(),
    authService: AuthService = new AuthService(),
  ) {
    this._matchesService = matchesService;
    this._authService = authService;
  }

  public async getMatches(_req: Request, res: Response): Promise<Response> {
    const results = await this._matchesService.getMatches();
    return res.status(StatusCodes.OK).json(results);
  }

  public async getMatchesInProgress(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const { inProgress } = req.query;
    if (!inProgress) {
      return next();
    }
    const results = await this._matchesService
      .getMatchesInProgress(inProgress === 'true');
    return res.status(StatusCodes.OK).json(results);
  }

  public async createMatch(
    req: Request,
    res: Response,
  ): Promise<Response | void> {
    const jwtData = this._authService.verify(req.headers.authorization as string);
    if (!jwtData) {
      throw new GenericError('Invalid token', StatusCodes.UNAUTHORIZED);
    }
    const result = await this._matchesService.createMatch(req.body);
    return res.status(StatusCodes.OK).json(result);
  }

  public async updateMatch(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    await this._matchesService.finishMatch(true, Number(id));
    return res.status(StatusCodes.OK).json({ message: 'Finished' });
  }
}

export default MatchesController;
