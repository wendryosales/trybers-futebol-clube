import Team from '../database/models/team.model';

class TeamsService {
  private _teams: Team[];
  private _team: Team;

  public async getTeams(): Promise<Team[]> {
    const results = await Team.findAll();
    this._teams = results;
    return this._teams;
  }

  public async getTeam(id: number): Promise<Team> {
    const result = await Team.findByPk(id) as Team;
    this._team = result;
    return this._team;
  }
}

export default TeamsService;
