import { Request, Response } from "express";
import { AuditLogService } from "../services/AuditLogService";
import { AppError } from "../shared/errors";

export class AuditLogController {
    private auditLogService: AuditLogService;

    constructor() {
        this.auditLogService = new AuditLogService();
    }

    async listAll(req: Request, res: Response) {
        try {
            const result = await this.auditLogService.listAll();
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async listByUser(req: Request, res: Response) {
        try {
            const userId = req.params.userId as string;
            const result = await this.auditLogService.listByUser(userId);
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async listByCorrelation(req: Request, res: Response) {
        try {
            const correlationId = req.params.correlationId as string;
            const result = await this.auditLogService.listByCorrelation(correlationId);
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}