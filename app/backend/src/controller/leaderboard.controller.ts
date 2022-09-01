import { Request, Response } from 'express';
import LeaderboardService from '../service/leaderboard.service';
import MatchesService from '../service/matches.service';
import TeamsService from '../service/teams.service';
import { IMatch } from '../types/IMatch';

class LeaderboardController {
  private _matchesService: MatchesService;
  private _teamsService: TeamsService;
  private _leaderboardService: LeaderboardService;

  constructor(
    matchesService: MatchesService = new MatchesService(),
    teamsService: TeamsService = new TeamsService(),
    leaderboardService: LeaderboardService = new LeaderboardService(),
  ) {
    this._matchesService = matchesService;
    this._teamsService = teamsService;
    this._leaderboardService = leaderboardService;
  }

  async getHomeBoard(_req: Request, res: Response): Promise<void> {
    const finishedMatches = await this._matchesService
      .getMatchesInProgress(false) as unknown as IMatch[];
    const allTeams = await this._teamsService.getTeams();
    const homeLeaderboard = this._leaderboardService.getHomeBoard(finishedMatches, allTeams);
    res.status(200).json(homeLeaderboard);
  }
}

export default LeaderboardController;
