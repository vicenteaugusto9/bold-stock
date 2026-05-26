/// <reference types="jest" />

jest.mock('../lib/prisma', () => ({
    __esModule: true,
    default: require('./helpers/prismaMock').default
}));

jest.mock('../services/AuditLogService', () => ({
    AuditLogService: jest.fn().mockImplementation(() => ({
        log: jest.fn().mockResolvedValue({})
    }))
}));

import prismaMock from './helpers/prismaMock';
import { PaymentService } from '../services/PaymentService';

beforeEach(() => { jest.clearAllMocks(); });

describe('PaymentService', () => {

    const mockSale = {
        id: 'sale-id-1', status: 'PENDING', total: 50 as any,
        correlationId: 'corr-id-1', userId: 'user-id-1', payment: null
    };

    it('deve lançar erro se venda não encontrada', async () => {
        prismaMock.sale.findUnique.mockResolvedValue(null);

        const service = new PaymentService();

        await expect(
            service.process({ saleId: 'id-inexistente', method: 'PIX', idempotencyKey: 'key-001' })
        ).rejects.toThrow('Venda não encontrada');
    });

    it('deve lançar erro se venda não estiver pendente', async () => {
        prismaMock.sale.findUnique.mockResolvedValue({ ...mockSale, status: 'CONFIRMED' } as any);

        const service = new PaymentService();

        await expect(
            service.process({ saleId: 'sale-id-1', method: 'PIX', idempotencyKey: 'key-001' })
        ).rejects.toThrow('Venda não está pendente de pagamento');
    });

    it('deve retornar pagamento existente se idempotencyKey já usada', async () => {
        prismaMock.sale.findUnique.mockResolvedValue(mockSale as any);
        prismaMock.payment.findUnique.mockResolvedValue({
            id: 'pay-id-1', status: 'CONFIRMED',
            method: 'PIX', amount: 50 as any,
            idempotencyKey: 'key-001', saleId: 'sale-id-1', createdAt: new Date()
        });

        const service = new PaymentService();
        const result = await service.process({ saleId: 'sale-id-1', method: 'PIX', idempotencyKey: 'key-001' });

        expect(result.message).toBe('Pagamento já processado anteriormente');
    });

    it('deve lançar erro se pagamento não encontrado para estorno', async () => {
        prismaMock.payment.findUnique.mockResolvedValue(null);

        const service = new PaymentService();

        await expect(
            service.refund('pay-inexistente')
        ).rejects.toThrow('Pagamento não encontrado');
    });

    it('deve lançar erro ao estornar pagamento não confirmado', async () => {
        prismaMock.payment.findUnique.mockResolvedValue({
            id: 'pay-id-1', status: 'REFUNDED',
            saleId: 'sale-id-1'
        } as any);

        const service = new PaymentService();

        await expect(
            service.refund('pay-id-1')
        ).rejects.toThrow('Apenas pagamentos confirmados podem ser estornados');
    });

    it('deve lançar erro se nenhum pagamento encontrado no listAll', async () => {
        prismaMock.payment.findMany.mockResolvedValue([]);

        const service = new PaymentService();

        await expect(
            service.listAll()
        ).rejects.toThrow('Nenhum pagamento encontrado');
    });
});