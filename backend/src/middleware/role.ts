import { Request, Response, NextFunction } from 'express';
import { Role } from '../generated/prisma';

export function isAuthorized(...roles: Role[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.user_role as Role;

        if (!roles.includes(userRole)) {
            return res.status(403).json({ 
                error: "Você não tem permissão para acessar este recurso" 
            });
        }

        return next();
    }
}