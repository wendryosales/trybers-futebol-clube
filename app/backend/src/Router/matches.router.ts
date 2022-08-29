import { Router } from 'express';
import MatchesController from '../controller/matches.controller';

const router = Router();

const matchesController = new MatchesController();

router.patch('/:id/finish', (req, res) => matchesController.finishMatch(req, res));
router.get(
  '/',
  (req, res, next) => matchesController.getMatchesInProgress(req, res, next),
  (req, res) => matchesController.getMatches(req, res),
);
router.post('/', (req, res) => matchesController.createMatch(req, res));

export default router;
