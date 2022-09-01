import { IBoardTeam } from '../types/IBoardTeam';
import { IMatch } from '../types/IMatch';
import { IResults } from '../types/IResults';
import { ITeam } from '../types/ITeam';

class LeaderboardService {
  private _result: IResults[];
  private _boardResult: IBoardTeam[];

  public getHomeBoard = (finishedMatches: IMatch[], teams: ITeam[]): IBoardTeam[] => {
    const teamsNames = teams.map(({ teamName }) => teamName);
    this.matchResults(finishedMatches);
    this.groupByTeam(teamsNames, 'home');
    return this.resultSorter();
  };

  private matchResults(finishedMatches: IMatch[]) {
    this._result = finishedMatches.map(({ homeTeamGoals, awayTeamGoals, teamHome, teamAway }) => {
      const homeSG = homeTeamGoals - awayTeamGoals;
      let homePoints = 0;
      let awayPoints = 0;
      if (homeSG === 0) {
        homePoints = 1;
        awayPoints = 1;
      }
      if (homeSG > 0) homePoints = 3;
      if (homeSG < 0) awayPoints = 3;
      const numericData = { homePoints, awayPoints, homeTeamGoals, awayTeamGoals };
      return ({
        ...numericData,
        homeTeam: teamHome.teamName,
        awayTeam: teamAway.teamName,
      });
    });
    return this._result;
  }

  private groupByTeam(
    teamsNames: string[],
    homeAway: 'home' | 'away',
  ) {
    this._boardResult = teamsNames.map((name) => {
      const totalPoints = this.totalPointsCalc(name, homeAway);
      const totalGamesData = this.totalGamesCalc(name, homeAway);
      const goalsData = this.goalsCalcs(name, homeAway);
      return ({
        name,
        totalPoints,
        ...totalGamesData,
        ...goalsData,
        efficiency: ((100 * totalPoints) / (totalGamesData.totalGames * 3)).toFixed(2),
      });
    });
  }

  private totalPointsCalc(
    teamName: string,
    homeAway: 'home' | 'away',
  ) {
    return this._result.reduce((acc, curr) => {
      if (curr[`${homeAway}Team`] === teamName) {
        return acc + curr[`${homeAway}Points`];
      }
      return acc;
    }, 0);
  }

  private totalGamesCalc(
    teamName: string,
    homeAway: 'home' | 'away',
  ) {
    return this._result.reduce((acc, curr) => {
      if (curr[`${homeAway}Team`] === teamName) {
        const totalGames = acc.totalGames + 1;
        let { totalVictories, totalDraws, totalLosses } = acc;
        if (curr[`${homeAway}Points`] === 1) totalDraws = acc.totalDraws + 1;
        if (curr[`${homeAway}Points`] === 3) totalVictories = acc.totalVictories + 1;
        if (curr[`${homeAway}Points`] === 0) totalLosses = acc.totalLosses + 1;
        return { totalGames, totalVictories, totalDraws, totalLosses };
      }
      return acc;
    }, { totalGames: 0, totalVictories: 0, totalDraws: 0, totalLosses: 0 });
  }

  private goalsCalcs(
    teamName: string,
    homeAway: 'home' | 'away',
  ) {
    return this._result.reduce((acc, curr) => {
      if (curr[`${homeAway}Team`] === teamName) {
        const opp = homeAway === 'home' ? 'away' : 'home';
        const goalsFavor = acc.goalsFavor + curr[`${homeAway}TeamGoals`];
        const goalsOwn = acc.goalsOwn + curr[`${opp}TeamGoals`];
        return { goalsBalance: goalsFavor - goalsOwn, goalsFavor, goalsOwn };
      }
      return acc;
    }, { goalsBalance: 0, goalsFavor: 0, goalsOwn: 0 });
  }

  private resultSorter() {
    const sorter = (a: IBoardTeam, b: IBoardTeam) => b.totalPoints - a.totalPoints
      || b.totalVictories - a.totalVictories
      || b.goalsBalance - a.goalsBalance
      || b.goalsFavor - a.goalsFavor
      || b.goalsOwn - a.goalsOwn;
    return this._boardResult.sort(sorter);
  }
}

export default LeaderboardService;
