import { Request, Response } from 'express';
import { updateTransactionStatusSchema } from '../schemas-zod/transactionSchema';
import * as transactionService from '../services/transactionService';

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Unknown error occurred';
  }

  export const createTransaction = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const { eventId, quantity } = req.body;
  
      const transaction = await transactionService.createTransaction(userId, { eventId, quantity });
      res.status(201).json(transaction); // hasil dikembalikan ke frontend
    } catch (error) {
      res.status(400).json({ message: getErrorMessage(error) });
    }
  };
  export const uploadPaymentProof = async (req: Request, res: Response) => {
    try {
      const { transactionId } = req.params;
      const userId = (req as any).user.id;
      const file = req.file;
  
      //debug - akan di delete
      console.log('[UPLOAD] Transaction ID:', transactionId);
      console.log('[UPLOAD] User ID:', userId);
      console.log('[UPLOAD] File Info:', file);
  
      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      const result = await transactionService.uploadPaymentProof(
        userId,
        transactionId,
        file.path
      );
  
      res.status(200).json({
        message: 'Payment proof uploaded',
        transaction: result
      });
    } catch (error) {
      console.error('[UPLOAD ERROR]', error);
      res.status(400).json({ message: getErrorMessage(error) });
    }
  };
  

export const updateTransactionStatus = async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    const organizerId = (req as any).user.id;
    const { status } = updateTransactionStatusSchema.parse(req.body);

    const result = await transactionService.updateTransactionStatus(
      organizerId,
      transactionId,
      status
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: getErrorMessage(error) });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const organizerId = (req as any).user.id;
    const transactions = await transactionService.getAllTransactionsForOrganizer(organizerId);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({ message: getErrorMessage(error) });
  }
};
