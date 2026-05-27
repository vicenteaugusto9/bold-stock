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
    it('deve listar produtos com sucesso', async () => {
    prismaMock.product.findMany.mockResolvedValue([{
        id: 'prod-id-1', name: 'Coca-Cola', sku: 'COC-001',
        price: 8.99 as any, costPrice: 5.50 as any,
        unit: 'UN', active: true,
        category: { id: 'cat-id-1', name: 'Bebidas' },
        stock: { available: 100, reserved: 0 }
    }] as any);

    const service = new ProductService();
    const result = await service.listAll();

    expect(result.message).toContain('Produtos listados');
});

it('deve buscar produto por id com sucesso', async () => {
    prismaMock.product.findUnique.mockResolvedValue({
        id: 'prod-id-1', name: 'Coca-Cola', sku: 'COC-001',
        price: 8.99 as any, costPrice: 5.50 as any,
        unit: 'UN', active: true,
        category: { id: 'cat-id-1', name: 'Bebidas' },
        stock: { available: 100, reserved: 0 }
    } as any);

    const service = new ProductService();
    const result = await service.findById('prod-id-1');

    expect(result.message).toBe('Produto encotrado');
});
it('deve criar produto com sucesso', async () => {
    prismaMock.$transaction.mockImplementation(async (fn: any) => {
        return fn({
            product: {
                findUnique: jest.fn().mockResolvedValue(null), // SKU não existe
                create: jest.fn().mockResolvedValue({
                    id: 'prod-id-1', name: 'Coca-Cola', sku: 'COC-001',
                    price: 8.99, costPrice: 5.50, unit: 'UN', active: true,
                    category: { id: 'cat-id-1', name: 'Bebidas' },
                    stock: { id: 'stock-id-1', available: 100, reserved: 0 }
                })
            },
            category: { findUnique: jest.fn().mockResolvedValue({ id: 'cat-id-1', name: 'Bebidas' }) },
            stockMovement: { create: jest.fn().mockResolvedValue({}) }
        });
    });

    const service = new ProductService();
    const result = await service.create({
        name: 'Coca-Cola', sku: 'COC-001', price: 8.99,
        costPrice: 5.50, categoryId: 'cat-id-1', initialStock: 100
    });

    expect(result.message).toBe('Produto criado com sucesso');
});

it('deve atualizar produto com sucesso', async () => {
    prismaMock.product.findUnique.mockResolvedValue(mockProduct);
    prismaMock.product.update.mockResolvedValue({ ...mockProduct, price: 9.99 as any });

    const service = new ProductService();
    const result = await service.update('prod-id-1', { price: 9.99 });

    expect(result.message).toBe('Produto updated com sucesso ');
});

it('deve lançar erro ao atualizar com SKU já cadastrado', async () => {
    prismaMock.product.findUnique
        .mockResolvedValueOnce(mockProduct)  // produto existe
        .mockResolvedValueOnce(mockProduct); // SKU já em uso

    const service = new ProductService();

    await expect(
        service.update('prod-id-1', { sku: 'SKU-EXISTENTE' })
    ).rejects.toThrow('SKU ja cadastrado');
});

it('deve lançar erro ao atualizar com categoria não encontrada', async () => {
    prismaMock.product.findUnique.mockResolvedValueOnce(mockProduct);
    prismaMock.category.findUnique.mockResolvedValue(null);

    const service = new ProductService();

    await expect(
        service.update('prod-id-1', { categoryId: 'cat-inexistente' })
    ).rejects.toThrow('Categoria nao encontrada');
});

it('deve desativar produto com sucesso', async () => {
    prismaMock.product.findUnique.mockResolvedValue(mockProduct);
    prismaMock.product.update.mockResolvedValue({ ...mockProduct, active: false });

    const service = new ProductService();
    const result = await service.deactivate('prod-id-1');

    expect(result.message).toBe(' Produto desativado com sucesso ');
});
});