import { Router } from 'express';
import LeaderboardController from '../controller/leaderboard.controller';

const router = Router();

const leaderboardController = new LeaderboardController();

router.get('/home', (req, res) => leaderboardController.getHomeBoard(req, res));

export default router;
