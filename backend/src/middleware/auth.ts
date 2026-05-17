import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface Payload {
    sub: string; // ID do usuário
}

interface AuthenticatedRequest extends Request {
    user_id: string; // ID do usuário extraído do token
} 

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {

  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: 'Token de autenticação nao fornecido' });
  }

  const [, token] = authToken.split(' ');

  try {
    const {sub} = verify(token, process.env.JWT_SECRET as string) as Payload;
  
    (req as any).user_id = sub; // Armazenamos o ID do usuário na requisição para uso posterior

    return next(); // Se o token for válido, passamos para a próxima função de middleware ou rota

  }
  catch (err) {
    return res.status(401).json({ error:'Token de autenticação invalido' });
  }
}