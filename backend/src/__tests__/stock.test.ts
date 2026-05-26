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
});