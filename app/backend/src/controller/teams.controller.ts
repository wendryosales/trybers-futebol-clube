import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import TeamsService from '../service/teams.service';

class TeamsController {
  private _teamsService: TeamsService;

  constructor(teamsService: TeamsService = new TeamsService()) {
    this._teamsService = teamsService;
  }

  public async getTeams(_req: Request, res: Response): Promise<Response> {
    const results = await this._teamsService.getTeams();
    return res.status(StatusCodes.OK).json(results);
  }

  public async getTeam(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const result = await this._teamsService.getTeam(Number(id));
    return res.status(StatusCodes.OK).json(result);
  }
}

export default TeamsController;
