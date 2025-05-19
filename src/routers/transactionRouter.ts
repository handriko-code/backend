import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import * as transactionController from '../controllers/transactionController';
import { catchAsync } from '../utils/catchAsync';
import { upload } from '../utils/cloudinary';

const router = Router();

router.use(authMiddleware);

// mengizinkan CUSTOMER upload sebelum roleMiddleware block
router.post(
  '/:transactionId/upload',
  upload.single('file'),
  catchAsync(transactionController.uploadPaymentProof)
);

// CUSTOMER melakukan transaction beli tiket
router.post('/', catchAsync(transactionController.createTransaction));

// hanya ORGANIZER dapat access
router.use(roleMiddleware('ORGANIZER'));

router.get('/', catchAsync(transactionController.getAllTransactions));
router.put('/:transactionId', catchAsync(transactionController.updateTransactionStatus));

export default router;
