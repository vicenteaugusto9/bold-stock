import { Request, Response } from "express";
import { PaymentService } from "../services/PaymentService";
import { AppError } from "../shared/errors";

export class PaymentController {
    private paymentService: PaymentService;

    constructor() {
        this.paymentService = new PaymentService();
    }

    async process(req: Request, res: Response) {
        try {
            const { saleId, method, idempotencyKey } = req.body;

            if (!saleId || !method || !idempotencyKey) {
                throw new AppError("saleId, method e idempotencyKey são obrigatórios", 400);
            }

            const result = await this.paymentService.process({ saleId, method, idempotencyKey });
            return res.status(201).json(result);

        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async refund(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const result = await this.paymentService.refund(id);
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
            const id = req.params.id as string;
            const result = await this.paymentService.findById(id);
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
            const result = await this.paymentService.listAll();
            return res.status(200).json(result);

        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}