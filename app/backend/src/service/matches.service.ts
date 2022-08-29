import { StatusCodes } from 'http-status-codes';
import Match from '../database/models/match.model';
import Team from '../database/models/team.model';
import GenericError from '../error/generic.error';
import TeamsService from './teams.service';

class MatchesService {
  private _matches: Match[];
  private _matchesInProgress: Match[];
  private _match: Match;
  private _teamsService: TeamsService;

  constructor(teamService: TeamsService = new TeamsService()) {
    this._teamsService = teamService;
  }

  public async getMatches(): Promise<Match[]> {
    this._matches = await Match.findAll({
      include: [
        {
          model: Team,
          as: 'teamHome',
          attributes: ['teamName'],
        },
        {
          model: Team,
          as: 'teamAway',
          attributes: ['teamName'],
        },
      ],
    });
    return this._matches;
  }

  public async getMatchesInProgress(yesOrNo: boolean): Promise<Match[]> {
    this._matchesInProgress = await Match.findAll({
      include: [
        {
          model: Team,
          as: 'teamHome',
          attributes: ['teamName'],
        },
        {
          model: Team,
          as: 'teamAway',
          attributes: ['teamName'],
        },
      ],
      where: {
        inProgress: yesOrNo,
      },
    });
    return this._matchesInProgress;
  }

  public async createMatch(): Promise<Match> {
    return Match.create({ ...this._match, inProgress: true });
  }

  public async finishMatch(id: number): Promise<[number, Match[]]> {
    const status = await Match.update(
      { inProgress: false },
      { where: { id } },
    );
    this._match = await Match.findByPk(id) as Match;
    return status;
  }

  public async validateMatch(match: Match): Promise<Match> {
    if (match.homeTeam === match.awayTeam) {
      throw new GenericError(
        'It is not possible to create a match with two equal teams',
        StatusCodes.UNAUTHORIZED,
      );
    }
    const team1 = await this._teamsService.getTeam(match.homeTeam);
    const team2 = await this._teamsService.getTeam(match.awayTeam);
    if (!team1 || !team2) {
      throw new GenericError(
        'There is no team with such id!',
        StatusCodes.NOT_FOUND,
      );
    }
    this._match = match;
    return this._match;
  }
}

export default MatchesService;
