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

  public async createMatch(req: Request, res: Response): Promise<Response> {
    const { body } = req;
    const result = await this._matchesService.createMatch(body);
    return res.status(StatusCodes.OK).json(result);
  }

  public async updateMatch(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    await this._matchesService.finishMatch(true, Number(id));
    return res.status(StatusCodes.OK).json({ message: 'Finished' });
  }
}

export default MatchesController;
