import { BOOLEAN, INTEGER, Model, NUMBER } from 'sequelize';
import db from '.';
import Team from './team.model';

class Match extends Model {
  id!: number;
  homeTeam!: number;
  homeTeamGoals!: number;
  awayTeam!: number;
  awayTeamGoals!: number;
  inProgress!: number;
}

Match.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  homeTeam: {
    type: NUMBER,
    allowNull: false,
  },
  homeTeamGoals: {
    type: NUMBER,
    allowNull: false,
  },
  awayTeam: {
    type: NUMBER,
    allowNull: false,
  },
  awayTeamGoals: {
    type: NUMBER,
    allowNull: false,
  },
  inProgress: {
    type: BOOLEAN,
    allowNull: false,
  },
}, {
  sequelize: db,
  modelName: 'matches',
  underscored: true,
  timestamps: false,
});

Match.belongsTo(Team, {
  foreignKey: 'home_team',
  targetKey: 'id',
  as: 'teamHome',
});
Match.belongsTo(Team, {
  foreignKey: 'away_team',
  targetKey: 'id',
  as: 'teamAway',
});
Team.hasMany(Match, {
  foreignKey: 'home_team',
  sourceKey: 'id',
  as: 'homeMatches',
});
Team.hasMany(Match, {
  foreignKey: 'away_team',
  sourceKey: 'id',
  as: 'awayMatches',
});

export default Match;
