import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface Payload {
    sub: string;
    role: string; // ✅ adicionado
}

// ✅ Extende o tipo do Express globalmente — sem 'as any'
declare global {
    namespace Express {
        interface Request {
            user_id: string;
            user_role: string; // ✅ role disponível em todas as rotas
        }
    }
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    const authToken = req.headers.authorization;

    if (!authToken) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const [, token] = authToken.split(' ');

    try {
        const { sub, role } = verify(token, process.env.JWT_SECRET as string) as Payload;

        req.user_id = sub;
        req.user_role = role; // ✅ disponível nas rotas

        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido' });
    }
}