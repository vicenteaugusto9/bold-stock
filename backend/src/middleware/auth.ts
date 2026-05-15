import { Request, Response, NextFunction } from 'express';

// Interface para request customizada
export interface CustomRequest extends Request {
  userId?: string;
}

// Exemplo de middleware de autenticação
export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    // Implementar lógica de autenticação aqui
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Middleware de erro
export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
};
