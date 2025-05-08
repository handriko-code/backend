import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import * as transactionController from '../controllers/transactionController';
import { catchAsync } from '../utils/catchAsync';
import { upload } from '../utils/cloudinary';

const router = Router();

router.use(authMiddleware);

// Allow CUSTOMER to upload before roleMiddleware block
router.post(
  '/:transactionId/upload',
  upload.single('file'),
  catchAsync(transactionController.uploadPaymentProof)
);

// Allow CUSTOMER to create transaction
router.post('/', catchAsync(transactionController.createTransaction));

// Only ORGANIZER can access below
router.use(roleMiddleware('ORGANIZER'));

router.get('/', catchAsync(transactionController.getAllTransactions));
router.put('/:transactionId', catchAsync(transactionController.updateTransactionStatus));

export default router;
