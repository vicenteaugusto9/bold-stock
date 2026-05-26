/// <reference types="jest" />
import { StockService } from '../services/Stockservice';
import { prismaMock } from './helpers/prismaMock';

describe('StockService', () => {

    const mockStock = {
        id: 'stock-id-1',
        productId: 'prod-id-1',
        available: 100,
        reserved: 0,
        updatedAt: new Date()
    };

    it('deve registrar entrada no estoque', async () => {
        prismaMock.stock.findUnique.mockResolvedValue(mockStock);
        prismaMock.$transaction.mockImplementation(async (fn: any) => fn(prismaMock));
        prismaMock.stock.update.mockResolvedValue({ ...mockStock, available: 150 });
        prismaMock.stockMovement.create.mockResolvedValue({} as any);

        const service = new StockService();
        const result = await service.addEntry({
            productId: 'prod-id-1',
            quantity: 50,
            correlationId: undefined // ✅ campo opcional mas precisa estar presente
        });

        expect(result.message).toContain('50 unidades');
    });

    it('deve lançar erro se quantidade for zero ou negativa', async () => {
        const service = new StockService();

        await expect(
            service.addEntry({
                productId: 'prod-id-1',
                quantity: 0,
                correlationId: undefined // ✅ mesmo aqui
            })
        ).rejects.toThrow('Quantidade deve ser maior que zero');
    });

    it('deve lançar erro se estoque insuficiente para reserva', async () => {
        prismaMock.stock.findUnique.mockResolvedValue({
            ...mockStock,
            available: 5
        });

        const service = new StockService();

        await expect(
            service.reserve({
                productId: 'prod-id-1',
                quantity: 10,
                correlationId: undefined // ✅ mesmo aqui
            })
        ).rejects.toThrow('Estoque insuficiente');
    });
});