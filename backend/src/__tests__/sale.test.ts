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
});