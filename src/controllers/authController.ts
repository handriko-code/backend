import { Request, Response } from 'express';
import { register, login } from '../services/authService';
import { registerSchema, loginSchema } from '../schemas-zod/authSchema';

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Unknown error occurred';
  }
  
  export const registerUser = async (req: Request, res: Response) => {
    try {
      const data = registerSchema.parse(req.body);
      const result = await register(data);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: getErrorMessage(error) });
    }
  };
  
  export const loginUser = async (req: Request, res: Response) => {
    console.log('BODY:' , req.body); //Untuk memastikan req.body benar-benar berisi { email, password } saat request masuk dari Postman.
        
    try {
      const data = loginSchema.parse(req.body);
      const result = await login(data);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: getErrorMessage(error) });
    }
  };