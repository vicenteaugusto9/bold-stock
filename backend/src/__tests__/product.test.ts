/// <reference types="jest" />

jest.mock('../lib/prisma', () => ({
    __esModule: true,
    default: require('./helpers/prismaMock').default
}));

import prismaMock from './helpers/prismaMock';
import { ProductService } from '../services/ProductService';

beforeEach(() => { jest.clearAllMocks(); });

describe('ProductService', () => {

    const mockProduct = {
        id: 'prod-id-1', name: 'Coca-Cola', sku: 'COC-001',
        price: 8.99 as any, costPrice: 5.50 as any,
        unit: 'UN', active: true, categoryId: 'cat-id-1', createdAt: new Date()
    };

    it('deve lançar erro se SKU já cadastrado', async () => {
        prismaMock.$transaction.mockImplementation(async (fn: any) => {
            return fn({
                product: { findUnique: jest.fn().mockResolvedValue(mockProduct) },
                category: { findUnique: jest.fn() },
                stockMovement: { create: jest.fn() }
            });
        });

        const service = new ProductService();

        await expect(
            service.create({ name: 'Pepsi', sku: 'COC-001', price: 7.99, costPrice: 4.50, categoryId: 'cat-id-1' })
        ).rejects.toThrow('sku ja cadastrado');
    });

    it('deve lançar erro se categoria não encontrada', async () => {
        prismaMock.$transaction.mockImplementation(async (fn: any) => {
            return fn({
                product: { findUnique: jest.fn().mockResolvedValue(null) },
                category: { findUnique: jest.fn().mockResolvedValue(null) },
                stockMovement: { create: jest.fn() }
            });
        });

        const service = new ProductService();

        await expect(
            service.create({ name: 'Produto', sku: 'SKU-NOVO', price: 10, costPrice: 5, categoryId: 'cat-inexistente' })
        ).rejects.toThrow('Categoria nao encontrada');
    });

    it('deve lançar erro se produto não encontrado no findById', async () => {
        prismaMock.product.findUnique.mockResolvedValue(null);

        const service = new ProductService();

        await expect(
            service.findById('id-inexistente')
        ).rejects.toThrow('produto nao encontrado');
    });

    it('deve lançar erro ao desativar produto não encontrado', async () => {
        prismaMock.product.findUnique.mockResolvedValue(null);

        const service = new ProductService();

        await expect(
            service.deactivate('id-inexistente')
        ).rejects.toThrow('Produto nao encontrado');
    });

    it('deve lançar erro ao desativar produto já inativo', async () => {
        prismaMock.product.findUnique.mockResolvedValue({
            ...mockProduct, active: false
        });

        const service = new ProductService();

        await expect(
            service.deactivate('prod-id-1')
        ).rejects.toThrow('produto ja esta inativo');
    });

    it('deve lançar erro ao atualizar produto não encontrado', async () => {
        prismaMock.product.findUnique.mockResolvedValue(null);

        const service = new ProductService();

        await expect(
            service.update('id-inexistente', { name: 'Novo Nome' })
        ).rejects.toThrow('Produto nao encotrado');
    });
});