import { Router } from 'express';
import TeamsController from '../controller/teams.controller';

const router = Router();

const teamsController = new TeamsController();

router.get('/', (req, res) => teamsController.getTeams(req, res));
router.get('/:id', (req, res) => teamsController.getTeam(req, res));

export default router;
