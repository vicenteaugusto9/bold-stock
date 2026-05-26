import { SaleService } from '../services/SaleService';
import { prismaMock } from './helpers/prismaMock';

describe('SaleService', () => {

    const mockCustomer = {
        id: 'cust-id-1', name: 'Maria', document: '52998224725',
        email: null, phone: null, active: true, createdAt: new Date()
    };

    const mockUser = {
        id: 'user-id-1', name: 'João', email: 'joao@test.com',
        password: 'hash', role: 'VENDEDOR' as const, createdAt: new Date()
    };

    const mockProduct = {
        id: 'prod-id-1', name: 'Coca-Cola', sku: 'COC-001',
        price: 8.99 as any, costPrice: 5.50 as any,
        unit: 'UN', active: true, categoryId: 'cat-id-1',
        createdAt: new Date(),
        stock: { id: 'stock-id-1', productId: 'prod-id-1', available: 100, reserved: 0, updatedAt: new Date() }
    };

    it('deve criar uma venda com sucesso', async () => {
        prismaMock.customer.findUnique.mockResolvedValue(mockCustomer);
        prismaMock.user.findUnique.mockResolvedValue(mockUser);
        prismaMock.product.findMany.mockResolvedValue([mockProduct]);
        prismaMock.$transaction.mockImplementation(async (fn: any) => fn(prismaMock));
        prismaMock.sale.create.mockResolvedValue({
            id: 'sale-id-1',
            customerId: 'cust-id-1',
            userId: 'user-id-1',
            total: 26.97 as any,
            status: 'PENDING',
            correlationId: 'corr-id-1',
            createdAt: new Date(),
            items: [],
            customer: mockCustomer,
            user: mockUser
        } as any);
        prismaMock.stock.update.mockResolvedValue({} as any);
        prismaMock.stockMovement.create.mockResolvedValue({} as any);
        prismaMock.auditLog.create.mockResolvedValue({} as any);

        const service = new SaleService();
        const result = await service.create({
            customerId: 'cust-id-1',
            userId: 'user-id-1',
            items: [{ productId: 'prod-id-1', quantity: 3 }]
        });

        expect(result.message).toBe('Venda criada e estoque reservado');
    });

   it('deve lançar erro se estoque insuficiente', async () => {
    prismaMock.customer.findUnique.mockResolvedValue(mockCustomer);
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    
    // ✅ adiciona 'as any' para contornar tipagem estrita do mock
    prismaMock.product.findMany.mockResolvedValue([{
        ...mockProduct,
        stock: { ...mockProduct.stock, available: 2 }
    }] as any);

    const service = new SaleService();

    await expect(
        service.create({
            customerId: 'cust-id-1',
            userId: 'user-id-1',
            items: [{ productId: 'prod-id-1', quantity: 10 }]
        })
    ).rejects.toThrow('Estoque insuficiente');
});

    it('deve lançar erro ao cancelar venda já confirmada', async () => {
        prismaMock.sale.findUnique.mockResolvedValue({
            id: 'sale-id-1',
            status: 'CONFIRMED',
            items: []
        } as any);

        const service = new SaleService();

        await expect(
            service.cancel('sale-id-1')
        ).rejects.toThrow('Venda já confirmada não pode ser cancelada');
    });
});