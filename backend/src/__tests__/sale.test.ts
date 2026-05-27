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
import { SaleService } from '../services/SaleService';

beforeEach(() => { jest.clearAllMocks(); });

describe('SaleService', () => {

    const mockCustomer = {
        id: 'cust-id-1', name: 'Maria', document: '52998224725',
        email: null, phone: null, active: true, createdAt: new Date()
    };

    const mockUser = {
        id: 'user-id-1', name: 'João', email: 'joao@test.com',
        password: 'hash', role: 'VENDEDOR' as const, createdAt: new Date()
    };

    const mockStock = {
        id: 'stock-id-1', productId: 'prod-id-1',
        available: 100, reserved: 0, updatedAt: new Date()
    };

    const mockProduct = {
        id: 'prod-id-1', name: 'Coca-Cola', sku: 'COC-001',
        price: 8.99 as any, costPrice: 5.50 as any,
        unit: 'UN', active: true, categoryId: 'cat-id-1',
        createdAt: new Date(), stock: mockStock
    };

    it('deve lançar erro se cliente não encontrado', async () => {
        prismaMock.customer.findUnique.mockResolvedValue(null);

        const service = new SaleService();

        await expect(
            service.create({ customerId: 'id-inexistente', userId: 'user-id-1', items: [{ productId: 'prod-id-1', quantity: 1 }] })
        ).rejects.toThrow('Cliente não encontrado');
    });

    it('deve lançar erro se estoque insuficiente', async () => {
        prismaMock.customer.findUnique.mockResolvedValue(mockCustomer);
        prismaMock.user.findUnique.mockResolvedValue(mockUser);
        prismaMock.product.findMany.mockResolvedValue([{
            ...mockProduct, stock: { ...mockStock, available: 2 }
        }] as any);

        const service = new SaleService();

        await expect(
            service.create({ customerId: 'cust-id-1', userId: 'user-id-1', items: [{ productId: 'prod-id-1', quantity: 10 }] })
        ).rejects.toThrow('Estoque insuficiente para o produto');
    });

    it('deve lançar erro ao cancelar venda já confirmada', async () => {
        prismaMock.sale.findUnique.mockResolvedValue({
            id: 'sale-id-1', status: 'CONFIRMED', items: []
        } as any);

        const service = new SaleService();

        await expect(
            service.cancel('sale-id-1')
        ).rejects.toThrow('Venda já confirmada não pode ser cancelada');
    });

    it('deve lançar erro ao cancelar venda já cancelada', async () => {
        prismaMock.sale.findUnique.mockResolvedValue({
            id: 'sale-id-1', status: 'CANCELLED', items: []
        } as any);

        const service = new SaleService();

        await expect(
            service.cancel('sale-id-1')
        ).rejects.toThrow('Venda já está cancelada');
    });

    it('deve lançar erro se venda não encontrada no findById', async () => {
        prismaMock.sale.findUnique.mockResolvedValue(null);

        const service = new SaleService();

        await expect(
            service.findById('id-inexistente')
        ).rejects.toThrow('Venda não encontrada');
    });

    it('deve lançar erro se nenhuma venda encontrada no listAll', async () => {
        prismaMock.sale.findMany.mockResolvedValue([]);

        const service = new SaleService();

        await expect(
            service.listAll()
        ).rejects.toThrow('Nenhuma venda encontrada');
    });
    it('deve listar vendas com sucesso', async () => {
    prismaMock.sale.findMany.mockResolvedValue([{
        id: 'sale-id-1', status: 'CONFIRMED',
        // ...dados completos
    }] as any);

    const service = new SaleService();
    const result = await service.listAll();

    expect(result.message).toBe('Vendas listadas com sucesso');
});
it('deve buscar venda por id com sucesso', async () => {
    prismaMock.sale.findUnique.mockResolvedValue({
        id: 'sale-id-1', status: 'CONFIRMED', total: 50 as any,
        correlationId: 'corr-id-1', createdAt: new Date(),
        customer: { id: 'cust-id-1', name: 'Maria', document: '52998224725' },
        user: { id: 'user-id-1', name: 'João' },
        payment: null, items: []
    } as any);

    const service = new SaleService();
    const result = await service.findById('sale-id-1');

    expect(result.message).toBe('Venda encontrada');
});
it('deve lançar erro se usuário não encontrado', async () => {
    prismaMock.customer.findUnique.mockResolvedValue(mockCustomer);
    prismaMock.user.findUnique.mockResolvedValue(null);

    const service = new SaleService();

    await expect(
        service.create({ customerId: 'cust-id-1', userId: 'id-inexistente', items: [{ productId: 'prod-id-1', quantity: 1 }] })
    ).rejects.toThrow('Usuário não encontrado');
});

it('deve lançar erro se produto não encontrado na venda', async () => {
    prismaMock.customer.findUnique.mockResolvedValue(mockCustomer);
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    prismaMock.product.findMany.mockResolvedValue([]); // nenhum produto encontrado

    const service = new SaleService();

    await expect(
        service.create({ customerId: 'cust-id-1', userId: 'user-id-1', items: [{ productId: 'prod-inexistente', quantity: 1 }] })
    ).rejects.toThrow('Um ou mais produtos não encontrados ou inativos');
});

it('deve lançar erro ao confirmar pagamento de venda não encontrada', async () => {
    prismaMock.sale.findUnique.mockResolvedValue(null);

    const service = new SaleService();

    await expect(
        service.confirmPayment({ saleId: 'id-inexistente', method: 'PIX', idempotencyKey: 'key-001' })
    ).rejects.toThrow('Venda não encontrada');
});

it('deve lançar erro se pagamento já processado no confirmPayment', async () => {
    prismaMock.sale.findUnique.mockResolvedValue({
        id: 'sale-id-1', status: 'PENDING', items: [],
        total: 50 as any, correlationId: 'corr-id-1', userId: 'user-id-1'
    } as any);
    prismaMock.payment.findUnique.mockResolvedValue({
        id: 'pay-id-1', status: 'CONFIRMED'
    } as any);

    const service = new SaleService();

    await expect(
        service.confirmPayment({ saleId: 'sale-id-1', method: 'PIX', idempotencyKey: 'key-001' })
    ).rejects.toThrow('Pagamento já processado');
});
it('deve criar venda com sucesso', async () => {
    prismaMock.customer.findUnique.mockResolvedValue(mockCustomer);
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    prismaMock.product.findMany.mockResolvedValue([mockProduct] as any);
    prismaMock.$transaction.mockImplementation(async (fn: any) => fn(prismaMock));
    prismaMock.sale.create.mockResolvedValue({
        id: 'sale-id-1', customerId: 'cust-id-1', userId: 'user-id-1',
        total: 26.97 as any, status: 'PENDING', correlationId: 'corr-id-1',
        createdAt: new Date(), items: [], customer: mockCustomer, user: mockUser
    } as any);
    prismaMock.stock.update.mockResolvedValue({} as any);
    prismaMock.stockMovement.create.mockResolvedValue({} as any);
    prismaMock.auditLog.create.mockResolvedValue({} as any);

    const service = new SaleService();
    const result = await service.create({
        customerId: 'cust-id-1', userId: 'user-id-1',
        items: [{ productId: 'prod-id-1', quantity: 3 }]
    });

    expect(result.message).toBe('Venda criada e estoque reservado');
});

it('deve confirmar pagamento com sucesso', async () => {
    prismaMock.sale.findUnique.mockResolvedValue({
        id: 'sale-id-1', status: 'PENDING', items: [],
        total: 50 as any, correlationId: 'corr-id-1', userId: 'user-id-1'
    } as any);
    prismaMock.payment.findUnique.mockResolvedValue(null);
    prismaMock.$transaction.mockImplementation(async (fn: any) => fn(prismaMock));
    prismaMock.payment.create.mockResolvedValue({
        id: 'pay-id-1', status: 'CONFIRMED'
    } as any);
    prismaMock.sale.update.mockResolvedValue({} as any);
    prismaMock.stock.findUnique.mockResolvedValue({} as any);
    prismaMock.stock.update.mockResolvedValue({} as any);
    prismaMock.stockMovement.create.mockResolvedValue({} as any);
    prismaMock.auditLog.create.mockResolvedValue({} as any);

    const service = new SaleService();
    const result = await service.confirmPayment({
        saleId: 'sale-id-1', method: 'PIX', idempotencyKey: 'key-novo'
    });

    expect(result.message).toBe('Pagamento confirmado e estoque baixado');
});

it('deve cancelar venda com sucesso', async () => {
    prismaMock.sale.findUnique.mockResolvedValue({
        id: 'sale-id-1', status: 'PENDING', items: [],
        correlationId: 'corr-id-1', userId: 'user-id-1'
    } as any);
    prismaMock.$transaction.mockImplementation(async (fn: any) => fn(prismaMock));
    prismaMock.sale.update.mockResolvedValue({} as any);
    prismaMock.auditLog.create.mockResolvedValue({} as any);

    const service = new SaleService();
    const result = await service.cancel('sale-id-1');

    expect(result.message).toBe('Venda cancelada e estoque liberado');
});
});