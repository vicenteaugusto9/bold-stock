/// <reference types="jest" />

jest.mock('../lib/prisma', () => ({
    __esModule: true,
    default: require('./helpers/prismaMock').default
}));

import prismaMock from './helpers/prismaMock';
import { CategoryService } from '../services/CategorySevice';

beforeEach(() => { jest.clearAllMocks(); });

describe('CategoryService', () => {

    it('deve criar uma categoria com sucesso', async () => {
        prismaMock.category.findUnique.mockResolvedValue(null);
        prismaMock.category.create.mockResolvedValue({ id: 'cat-id-1', name: 'Bebidas' });

        const service = new CategoryService();
        const result = await service.createCategory({ name: 'Bebidas' });

        expect(result.message).toBe('Categoria criada com sucesso!');
        expect(result.data.name).toBe('Bebidas');
    });

    it('deve lançar erro se categoria já existir', async () => {
        prismaMock.category.findUnique.mockResolvedValue({ id: 'cat-id-1', name: 'Bebidas' });

        const service = new CategoryService();

        await expect(
            service.createCategory({ name: 'Bebidas' })
        ).rejects.toThrow('Categoria já existente no sistema.');
    });

    it('deve lançar erro ao deletar categoria com produtos', async () => {
        prismaMock.category.findUnique.mockResolvedValue({
            id: 'cat-id-1', name: 'Bebidas',
            _count: { products: 3 }
        } as any);

        const service = new CategoryService();

        await expect(
            service.deleteCategory('cat-id-1')
        ).rejects.toThrow('Não é possível deletar uma categoria que possui produtos associados.');
    });

    it('deve lançar erro ao deletar categoria não encontrada', async () => {
        prismaMock.category.findUnique.mockResolvedValue(null);

        const service = new CategoryService();

        await expect(
            service.deleteCategory('id-inexistente')
        ).rejects.toThrow('Categoria não encontrada.');
    });

    it('deve lançar erro ao atualizar categoria não encontrada', async () => {
        prismaMock.category.findUnique.mockResolvedValue(null);

        const service = new CategoryService();

        await expect(
            service.updateCategory('id-inexistente', 'Novo Nome')
        ).rejects.toThrow('Categoria não encontrada.');
    });
    it('deve listar categorias com sucesso', async () => {
    prismaMock.category.findMany.mockResolvedValue([
        { id: 'cat-id-1', name: 'Bebidas', _count: { products: 3 } }
    ] as any);

    const service = new CategoryService();
    const result = await service.listAllCategories();

    expect(result.message).toBe('Categorias listadas com sucesso!');
});

it('deve atualizar categoria com sucesso', async () => {
    prismaMock.category.findUnique.mockResolvedValue({ id: 'cat-id-1', name: 'Bebidas' });
    prismaMock.category.update.mockResolvedValue({ id: 'cat-id-1', name: 'Bebidas e Sucos' });

    const service = new CategoryService();
    const result = await service.updateCategory('cat-id-1', 'Bebidas e Sucos');

    expect(result.message).toBe('Categoria atualizada com sucesso!');
});

it('deve deletar categoria com sucesso', async () => {
    prismaMock.category.findUnique.mockResolvedValue({
        id: 'cat-id-1', name: 'Bebidas', _count: { products: 0 }
    } as any);
    prismaMock.category.delete.mockResolvedValue({} as any);

    const service = new CategoryService();
    const result = await service.deleteCategory('cat-id-1');

    expect(result.message).toBe('Categoria deletada com sucesso!');
});
});