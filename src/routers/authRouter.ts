import { Router } from 'express';
import { registerUser, loginUser, verifyEmail } from '../controllers/authController';
import { catchAsync } from '../utils/catchAsync';

const router = Router();

router.post('/register', catchAsync(registerUser));
router.get('/verify', catchAsync(verifyEmail));
router.post('/login', catchAsync(loginUser));

export default router;
