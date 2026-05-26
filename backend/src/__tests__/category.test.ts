import { CategoryService } from '../services/CategorySevice';
import { prismaMock } from './helpers/prismaMock';
import { AppError } from '../shared/errors';

describe('CategoryService', () => {

    it('deve criar uma categoria com sucesso', async () => {
        prismaMock.category.findUnique.mockResolvedValue(null);
        prismaMock.category.create.mockResolvedValue({
            id: 'cat-id-1',
            name: 'Bebidas'
        });

        const service = new CategoryService();
        const result = await service.createCategory({ name: 'Bebidas' });

        expect(result.message).toBe('Categoria criada com sucesso');
        expect(result.data.name).toBe('Bebidas');
    });

    it('deve lançar erro se categoria já existir', async () => {
        prismaMock.category.findUnique.mockResolvedValue({
            id: 'cat-id-1',
            name: 'Bebidas'
        });

        const service = new CategoryService();

        await expect(
            service.createCategory({ name: 'Bebidas' })
        ).rejects.toThrow('Categoria já cadastrada');
    });

    it('deve lançar erro ao deletar categoria com produtos', async () => {
        prismaMock.category.findUnique.mockResolvedValue({
            id: 'cat-id-1',
            name: 'Bebidas',
            _count: { products: 3 }
        } as any);

        const service = new CategoryService();

        await expect(
            service.deleteCategory('cat-id-1')
        ).rejects.toThrow('Categoria possui produtos vinculados');
    });
});