import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import * as dashboardController from '../controllers/dashboardController';

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware('ORGANIZER'));

router.get('/statistics', dashboardController.getStatistics);

export default router;
