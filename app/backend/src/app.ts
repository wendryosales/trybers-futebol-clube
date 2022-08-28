import * as express from 'express';
import 'express-async-errors';
import LoginController from './controller/login.controller';
import MatchesController from './controller/matches.controller';
import TeamsController from './controller/teams.controller';
import ErrorHandling from './error/errorHandling';

class App {
  public app: express.Express;
  private _errorHandling: ErrorHandling;
  private _loginController: LoginController;
  private _teamsController: TeamsController;
  private _matchesController: MatchesController;

  constructor() {
    this.app = express();
    this._loginController = new LoginController();
    this._teamsController = new TeamsController();
    this._matchesController = new MatchesController();
    this._errorHandling = new ErrorHandling();

    this.config();

    // Não remover essa rota
    this.app.get('/', (req, res) => res.json({ ok: true }));

    // Login
    this.app.post('/login', (req, res) => this._loginController.login(req, res));
    this.app.get('/login/validate', (req, res) => this._loginController.validate(req, res));

    // Teams
    this.app.get('/teams', (req, res) => this._teamsController.getTeams(req, res));
    this.app.get('/teams/:id', (req, res) => this._teamsController.getTeam(req, res));

    // Matches
    this.app.get(
      '/matches',
      (req, res, next) => this._matchesController.getMatchesInProgress(req, res, next),
      (req, res) => this._matchesController.getMatches(req, res),
    );

    this.app.use(this._errorHandling.middleware);
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(express.json());
    this.app.use(accessControl);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
