import { Request, Response } from "express";

export class MeController {
    handle(req: Request, res: Response) {
        return res.status(200).json({
            message: 'Você está autenticado no Bold Stock!',
            userId: req.user_id,   // ✅ sem 'as any' — tipagem do declare global
            role: req.user_role    // ✅ role disponível também
        });
    }
}