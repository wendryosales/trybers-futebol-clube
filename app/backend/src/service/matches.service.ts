import Match from '../database/models/match.model';
import Team from '../database/models/team.model';

class MatchesService {
  private _matches: Match[];
  private _matchesInProgress: Match[];
  private _match: Match;

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

  public async createMatch(match: Match): Promise<Match> {
    this._match = await Match.create({ ...match, inProgress: true });
    return this._match;
  }

  public async finishMatch(id: number): Promise<[number, Match[]]> {
    const status = await Match.update(
      { inProgress: false },
      { where: { id } },
    );
    this._match = await Match.findByPk(id) as Match;
    return status;
  }
}

export default MatchesService;
