import { Request, Response } from "express";
import { SaleService } from "..//services/SaleService";
import { AppError } from "../shared/errors";

export class SaleController {
    private saleService: SaleService;

    constructor() {
        this.saleService = new SaleService();
    }

    async create(req: Request, res: Response) {
        try {
            const { customerId, items } = req.body;
            const userId = req.user_id; // ✅ pega do token JWT

            if (!customerId || !items || items.length === 0) {
                throw new AppError("customerId e items são obrigatórios", 400);
            }

            const result = await this.saleService.create({ customerId, userId, items });
            return res.status(201).json(result);
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async confirmPayment(req: Request, res: Response) {
        try {
            const saleId = req.params.id as string;
            const { method, idempotencyKey } = req.body;

            if (!method || !idempotencyKey) {
                throw new AppError("method e idempotencyKey são obrigatórios", 400);
            }

            const result = await this.saleService.confirmPayment({ saleId, method, idempotencyKey });
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async cancel(req: Request, res: Response) {
        try {
            const saleId = req.params.id as string;
            const result = await this.saleService.cancel(saleId);
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async listAll(req: Request, res: Response) {
        try {
            const result = await this.saleService.listAll();
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const saleId = req.params.id as string;
            const result = await this.saleService.findById(saleId);
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}