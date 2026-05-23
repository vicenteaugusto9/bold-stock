import prisma from '../lib/prisma';
import { AppError } from '../shared/errors';
import { AuditLogService } from './AuditLogService';

const auditLogService = new AuditLogService();

interface CreateSaleDTO {
    customerId: string;
    userId: string;
    items: {
        productId: string;
        quantity: number;
    }[];
}

interface ConfirmPaymentDTO {
    saleId: string;
    method: 'PIX' | 'CARD' | 'CASH';
    idempotencyKey: string;
}

export class SaleService {

    async create({ customerId, userId, items }: CreateSaleDTO) {

        const customer = await prisma.customer.findUnique({
            where: { id: customerId }
        });

        if (!customer || !customer.active) {
            throw new AppError("Cliente não encontrado", 404);
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new AppError("Usuário não encontrado", 404);
        }

        const productIds = items.map(i => i.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds }, active: true },
            include: { stock: true }
        });

        if (products.length !== items.length) {
            throw new AppError("Um ou mais produtos não encontrados ou inativos", 404);
        }

        for (const item of items) {
            const product = products.find(p => p.id === item.productId);
            if (!product?.stock || product.stock.available < item.quantity) {
                throw new AppError(
                    `Estoque insuficiente para o produto: ${product?.name}`,
                    409
                );
            }
        }

        const total = items.reduce((acc, item) => {
            const product = products.find(p => p.id === item.productId)!;
            return acc + Number(product.price) * item.quantity;
        }, 0);

        const correlationId = crypto.randomUUID();

        // ✅ Transaction apenas com operações críticas do banco
        const sale = await prisma.$transaction(async (tx) => {
            const newSale = await tx.sale.create({
                data: {
                    customerId,
                    userId,
                    total,
                    status: 'PENDING',
                    correlationId,
                    items: {
                        create: items.map(item => {
                            const product = products.find(p => p.id === item.productId)!;
                            return {
                                productId: item.productId,
                                quantity: item.quantity,
                                price: product.price
                            };
                        })
                    }
                },
                include: {
                    items: {
                        include: {
                            product: { select: { id: true, name: true, sku: true } }
                        }
                    },
                    customer: { select: { id: true, name: true, document: true } },
                    user: { select: { id: true, name: true } }
                }
            });

            for (const item of items) {
                const product = products.find(p => p.id === item.productId)!;
                await tx.stock.update({
                    where: { productId: item.productId },
                    data: {
                        available: { decrement: item.quantity },
                        reserved: { increment: item.quantity }
                    }
                });
                await tx.stockMovement.create({
                    data: {
                        stockId: product.stock!.id,
                        type: 'RESERVE',
                        quantity: item.quantity,
                        correlationId
                    }
                });
            }

            return newSale;
        });

        // ✅ Log FORA da transaction — 'sale' já resolvido
        await auditLogService.log({
            userId,
            action: 'SALE_CREATED',
            correlationId: sale.correlationId,
            details: {
                saleId: sale.id,
                total: sale.total,
                itemCount: items.length
            }
        });

        return { data: sale, message: "Venda criada e estoque reservado" };
    }

    async confirmPayment({ saleId, method, idempotencyKey }: ConfirmPaymentDTO) {

        const sale = await prisma.sale.findUnique({
            where: { id: saleId },
            include: { items: true }
        });

        if (!sale) {
            throw new AppError("Venda não encontrada", 404);
        }

        if (sale.status !== 'PENDING') {
            throw new AppError("Venda não está pendente de pagamento", 409);
        }

        const existingPayment = await prisma.payment.findUnique({
            where: { idempotencyKey }
        });

        if (existingPayment) {
            throw new AppError("Pagamento já processado", 409);
        }

        // ✅ Transaction apenas com operações críticas
        const result = await prisma.$transaction(async (tx) => {
            const payment = await tx.payment.create({
                data: {
                    saleId,
                    method,
                    status: 'CONFIRMED',
                    idempotencyKey,
                    amount: sale.total
                }
            });

            await tx.sale.update({
                where: { id: saleId },
                data: { status: 'CONFIRMED' }
            });

            for (const item of sale.items) {
                const stock = await tx.stock.findUnique({
                    where: { productId: item.productId }
                });

                await tx.stock.update({
                    where: { productId: item.productId },
                    data: { reserved: { decrement: item.quantity } }
                });

                await tx.stockMovement.create({
                    data: {
                        stockId: stock!.id,
                        type: 'EXIT',
                        quantity: item.quantity,
                        correlationId: sale.correlationId
                    }
                });
            }

            return payment;
        });

        // ✅ Log FORA da transaction
        await auditLogService.log({
            userId: sale.userId,
            action: 'PAYMENT_CONFIRMED',
            correlationId: sale.correlationId,
            details: {
                paymentId: result.id,
                method,
                amount: sale.total
            }
        });

        return { data: result, message: "Pagamento confirmado e estoque baixado" };
    }

    async cancel(saleId: string) {

        const sale = await prisma.sale.findUnique({
            where: { id: saleId },
            include: { items: true }
        });

        if (!sale) {
            throw new AppError("Venda não encontrada", 404);
        }

        if (sale.status === 'CONFIRMED') {
            throw new AppError("Venda já confirmada não pode ser cancelada", 409);
        }

        if (sale.status === 'CANCELLED') {
            throw new AppError("Venda já está cancelada", 409);
        }

        // ✅ Transaction apenas com operações críticas
        await prisma.$transaction(async (tx) => {
            await tx.sale.update({
                where: { id: saleId },
                data: { status: 'CANCELLED' }
            });

            for (const item of sale.items) {
                const stock = await tx.stock.findUnique({
                    where: { productId: item.productId }
                });

                await tx.stock.update({
                    where: { productId: item.productId },
                    data: {
                        available: { increment: item.quantity },
                        reserved: { decrement: item.quantity }
                    }
                });

                await tx.stockMovement.create({
                    data: {
                        stockId: stock!.id,
                        type: 'RELEASE',
                        quantity: item.quantity,
                        correlationId: sale.correlationId
                    }
                });
            }
        });

        // ✅ Log FORA da transaction
        await auditLogService.log({
            userId: sale.userId,
            action: 'SALE_CANCELLED',
            correlationId: sale.correlationId,
            details: { saleId }
        });

        return { data: null, message: "Venda cancelada e estoque liberado" };
    }

    async listAll() {
        const sales = await prisma.sale.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                customer: { select: { id: true, name: true } },
                user: { select: { id: true, name: true } },
                payment: { select: { method: true, status: true } },
                items: { select: { quantity: true, price: true } }
            }
        });

        if (sales.length === 0) {
            throw new AppError("Nenhuma venda encontrada", 404);
        }

        return { data: sales, message: "Vendas listadas com sucesso" };
    }

    async findById(saleId: string) {
        const sale = await prisma.sale.findUnique({
            where: { id: saleId },
            include: {
                customer: { select: { id: true, name: true, document: true } },
                user: { select: { id: true, name: true } },
                payment: true,
                items: {
                    include: {
                        product: { select: { id: true, name: true, sku: true } }
                    }
                }
            }
        });

        if (!sale) {
            throw new AppError("Venda não encontrada", 404);
        }

        return { data: sale, message: "Venda encontrada" };
    }
}