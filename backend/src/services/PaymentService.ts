import prisma from '../lib/prisma';
import { AppError } from '../shared/errors';

interface ProcessPaymentDTO {
    saleId: string;
    method: 'PIX' | 'CARD' | 'CASH';
    idempotencyKey: string;
}

export class PaymentService {

    async process({ saleId, method, idempotencyKey }: ProcessPaymentDTO) {

        const sale = await prisma.sale.findUnique({
            where: { id: saleId },
            include: { payment: true }
        });

        if (!sale) {
            throw new AppError("Venda não encontrada", 404);
        }

        if (sale.status !== 'PENDING') {
            throw new AppError("Venda não está pendente de pagamento", 409);
        }

        // ✅ Idempotency — evita processar o mesmo pagamento duas vezes
        const existingPayment = await prisma.payment.findUnique({
            where: { idempotencyKey }
        });

        if (existingPayment) {
            return { data: existingPayment, message: "Pagamento já processado anteriormente" };
        }

        const result = await prisma.$transaction(async (tx) => {

            // 1. Cria o pagamento
            const payment = await tx.payment.create({
                data: {
                    saleId,
                    method,
                    status: 'CONFIRMED',
                    idempotencyKey,
                    amount: sale.total
                }
            });

            // 2. Confirma a venda
            await tx.sale.update({
                where: { id: saleId },
                data: { status: 'CONFIRMED' }
            });

            // 3. Baixa definitiva no estoque
            const saleItems = await tx.saleItem.findMany({
                where: { saleId },
                include: {
                    product: { include: { stock: true } }
                }
            });

            for (const item of saleItems) {
                await tx.stock.update({
                    where: { productId: item.productId },
                    data: { reserved: { decrement: item.quantity } }
                });

                await tx.stockMovement.create({
                    data: {
                        stockId: item.product.stock!.id,
                        type: 'EXIT',
                        quantity: item.quantity,
                        correlationId: sale.correlationId
                    }
                });
            }

            return payment;
        });

        return { data: result, message: "Pagamento confirmado com sucesso" };
    }

    async refund(paymentId: string) {

        const payment = await prisma.payment.findUnique({
            where: { id: paymentId },
            include: {
                sale: {
                    include: {
                        items: {
                            include: {
                                product: { include: { stock: true } }
                            }
                        }
                    }
                }
            }
        });

        if (!payment) {
            throw new AppError("Pagamento não encontrado", 404);
        }

        if (payment.status !== 'CONFIRMED') {
            throw new AppError("Apenas pagamentos confirmados podem ser estornados", 409);
        }

        await prisma.$transaction(async (tx) => {

            // 1. Estorna o pagamento
            await tx.payment.update({
                where: { id: paymentId },
                data: { status: 'REFUNDED' }
            });

            // 2. Cancela a venda
            await tx.sale.update({
                where: { id: payment.saleId },
                data: { status: 'CANCELLED' }
            });

            // 3. Devolve ao estoque disponível
            for (const item of payment.sale.items) {
                await tx.stock.update({
                    where: { productId: item.productId },
                    data: { available: { increment: item.quantity } }
                });

                await tx.stockMovement.create({
                    data: {
                        stockId: item.product.stock!.id,
                        type: 'ENTRY',
                        quantity: item.quantity,
                        correlationId: payment.sale.correlationId
                    }
                });
            }
        });

        return { data: null, message: "Pagamento estornado e estoque devolvido" };
    }

    async findById(id: string) {
        const payment = await prisma.payment.findUnique({
            where: { id },
            include: {
                sale: {
                    select: {
                        id: true,
                        status: true,
                        total: true,
                        correlationId: true,
                        customer: { select: { id: true, name: true } }
                    }
                }
            }
        });

        if (!payment) {
            throw new AppError("Pagamento não encontrado", 404);
        }

        return { data: payment, message: "Pagamento encontrado" };
    }

    async listAll() {
        const payments = await prisma.payment.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                sale: {
                    select: {
                        id: true,
                        status: true,
                        customer: { select: { id: true, name: true } }
                    }
                }
            }
        });

        if (payments.length === 0) {
            throw new AppError("Nenhum pagamento encontrado", 404);
        }

        return { data: payments, message: "Pagamentos listados com sucesso" };
    }
}