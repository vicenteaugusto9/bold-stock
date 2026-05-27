/// <reference types="jest" />

jest.mock('../lib/prisma', () => ({
    __esModule: true,
    default: require('./helpers/prismaMock').default
}));

import prismaMock from './helpers/prismaMock';
import { StockService } from '../services/Stockservice';

beforeEach(() => { jest.clearAllMocks(); });

describe('StockService', () => {

    const mockStock = {
        id: 'stock-id-1', productId: 'prod-id-1',
        available: 100, reserved: 0, updatedAt: new Date()
    };

    it('deve lançar erro se quantidade for zero no addEntry', async () => {
        const service = new StockService();

        await expect(
            service.addEntry({ productId: 'prod-id-1', quantity: 0 })
        ).rejects.toThrow('Quantidade deve ser maior que zero');
    });

    it('deve lançar erro se estoque não encontrado no addEntry', async () => {
        prismaMock.stock.findUnique.mockResolvedValue(null);

        const service = new StockService();

        await expect(
            service.addEntry({ productId: 'prod-id-1', quantity: 10 })
        ).rejects.toThrow('Estoque nao encontrado para este produto');
    });

    it('deve lançar erro se estoque insuficiente para reserva', async () => {
        prismaMock.stock.findUnique.mockResolvedValue({ ...mockStock, available: 5 });

        const service = new StockService();

        await expect(
            service.reserve({ productId: 'prod-id-1', quantity: 10 })
        ).rejects.toThrow('Estoque insuficiente');
    });

    it('deve lançar erro se quantidade negativa no adjustment', async () => {
        prismaMock.stock.findUnique.mockResolvedValue(mockStock);

        const service = new StockService();

        await expect(
            service.adJustment({ productId: 'prod-id-1', quantity: -1 })
        ).rejects.toThrow('Quantidade de ajuste nao pode ser negativa');
    });

    it('deve lançar erro se estoque não encontrado no getByProduct', async () => {
        prismaMock.stock.findUnique.mockResolvedValue(null);

        const service = new StockService();

        await expect(
            service.getByProduct('prod-inexistente')
        ).rejects.toThrow('Estoque nao encontrado para este produto');
    });

    it('deve lançar erro se reservado insuficiente para confirmExit', async () => {
        prismaMock.stock.findUnique.mockResolvedValue({ ...mockStock, reserved: 2 });

        const service = new StockService();

        await expect(
            service.confirmExit({ productId: 'prod-id-1', quantity: 5 })
        ).rejects.toThrow('Quantidade reservada insuficiente para confirmar saida');
    });
    it('deve buscar estoque por produto com sucesso', async () => {
    prismaMock.stock.findUnique.mockResolvedValue({
        id: 'stock-id-1', productId: 'prod-id-1',
        available: 100, reserved: 0, updatedAt: new Date(),
        product: { id: 'prod-id-1', name: 'Coca-Cola', sku: 'COC-001', unit: 'UN' },
        movements: []
    } as any);

    const service = new StockService();
    const result = await service.getByProduct('prod-id-1');

    expect(result.message).toBe('Estoque encontrado');
});

it('deve listar produtos com estoque baixo', async () => {
    prismaMock.stock.findMany.mockResolvedValue([{
        id: 'stock-id-1', productId: 'prod-id-1',
        available: 5, reserved: 0, updatedAt: new Date(),
        product: { id: 'prod-id-1', name: 'Coca-Cola', sku: 'COC-001', unit: 'UN' }
    }] as any);

    const service = new StockService();
    const result = await service.listLowStock();

    expect(result.message).toBe('Produtos com estoque baixo ');
    expect(result.data).toHaveLength(1);
});
it('deve registrar entrada com sucesso', async () => {
    prismaMock.stock.findUnique.mockResolvedValue(mockStock);
    prismaMock.$transaction.mockImplementation(async (fn: any) => fn(prismaMock));
    prismaMock.stock.update.mockResolvedValue({ ...mockStock, available: 150 });
    prismaMock.stockMovement.create.mockResolvedValue({} as any);

    const service = new StockService();
    const result = await service.addEntry({ productId: 'prod-id-1', quantity: 50 });

    expect(result.message).toBe('Entrada de 50 unidades registradas');
});

it('deve reservar estoque com sucesso', async () => {
    prismaMock.stock.findUnique.mockResolvedValue(mockStock);
    prismaMock.$transaction.mockImplementation(async (fn: any) => fn(prismaMock));
    prismaMock.stock.update.mockResolvedValue({ ...mockStock, available: 90, reserved: 10 });
    prismaMock.stockMovement.create.mockResolvedValue({} as any);

    const service = new StockService();
    const result = await service.reserve({ productId: 'prod-id-1', quantity: 10 });

    expect(result.message).toBe('10 unidades reservadas');
});

it('deve confirmar saída com sucesso', async () => {
    prismaMock.stock.findUnique.mockResolvedValue({ ...mockStock, reserved: 10 });
    prismaMock.$transaction.mockImplementation(async (fn: any) => fn(prismaMock));
    prismaMock.stock.update.mockResolvedValue({ ...mockStock, reserved: 0 });
    prismaMock.stockMovement.create.mockResolvedValue({} as any);

    const service = new StockService();
    const result = await service.confirmExit({ productId: 'prod-id-1', quantity: 10 });

    expect(result.message).toBe('Saida de 10 unidades confirmada');
});

it('deve liberar reserva com sucesso', async () => {
    prismaMock.stock.findUnique.mockResolvedValue({ ...mockStock, reserved: 10 });
    prismaMock.$transaction.mockImplementation(async (fn: any) => fn(prismaMock));
    prismaMock.stock.update.mockResolvedValue({ ...mockStock, available: 110, reserved: 0 });
    prismaMock.stockMovement.create.mockResolvedValue({} as any);

    const service = new StockService();
    const result = await service.release({ productId: 'prod-id-1', quantity: 10 });

    expect(result.message).toContain('unidades liberadas');
});

it('deve ajustar estoque com sucesso', async () => {
    prismaMock.stock.findUnique.mockResolvedValue(mockStock);
    prismaMock.$transaction.mockImplementation(async (fn: any) => fn(prismaMock));
    prismaMock.stock.update.mockResolvedValue({ ...mockStock, available: 50 });
    prismaMock.stockMovement.create.mockResolvedValue({} as any);

    const service = new StockService();
    const result = await service.adJustment({ productId: 'prod-id-1', quantity: 50 });

    expect(result.message).toBe('Estoque ajustado para 50 unidades');
});

it('deve listar movimentações com sucesso', async () => {
    prismaMock.stock.findUnique.mockResolvedValue(mockStock);
    prismaMock.stockMovement.findMany.mockResolvedValue([{
        id: 'mov-id-1', stockId: 'stock-id-1',
        type: 'ENTRY', quantity: 50, correlationId: null, createdAt: new Date()
    }] as any);

    const service = new StockService();
    const result = await service.getMovements('prod-id-1');

    expect(result.message).toBe('Movimentacoes encontradas ');
});
});