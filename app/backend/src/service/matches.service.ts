import Match from '../database/models/match.model';
import Team from '../database/models/team.model';

class MatchesService {
  private _matches: Match[];
  private _matchesInProgress: Match[];

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
}

export default MatchesService;
