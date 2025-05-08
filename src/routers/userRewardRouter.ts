import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import * as controller from '../controllers/userRewardController';
import { catchAsync } from '../utils/catchAsync';

const router = Router();

router.use(authMiddleware);

router.get('/referrals', catchAsync(controller.getMyReferrals));
router.get('/coupons', catchAsync(controller.getMyCoupons));

export default router;
