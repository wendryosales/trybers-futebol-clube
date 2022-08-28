import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import MatchesService from '../service/matches.service';

class MatchesController {
  private _matchesService: MatchesService;

  constructor(matchesService: MatchesService = new MatchesService()) {
    this._matchesService = matchesService;
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
}

export default MatchesController;
