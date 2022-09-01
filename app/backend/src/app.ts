import * as express from 'express';
import 'express-async-errors';
import ErrorHandling from './error/errorHandling';
import leaderboardRouter from './Router/leaderboard.router';
import loginRouter from './Router/login.router';
import matchesRouter from './Router/matches.router';
import teamsRouter from './Router/teams.router';

class App {
  public app: express.Express;
  private _errorHandling: ErrorHandling;

  constructor() {
    this.app = express();
    this._errorHandling = new ErrorHandling();

    this.config();

    // Não remover essa rota
    this.app.get('/', (req, res) => res.json({ ok: true }));
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
    // Login
    this.app.use('/login', loginRouter);

    // Teams
    this.app.use('/teams', teamsRouter);

    // Matches
    this.app.use('/matches', matchesRouter);

    // Leaderboard

    this.app.use('/leaderboard', leaderboardRouter);

    // Error Handling
    this.app.use(this._errorHandling.middleware);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
