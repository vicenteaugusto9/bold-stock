/// <reference types="jest" />

jest.mock('../lib/prisma', () => ({
    __esModule: true,
    default: require('./helpers/prismaMock').default
}));

import prismaMock from './helpers/prismaMock';
import { UserService } from '../services/userService';

beforeEach(() => { jest.clearAllMocks(); });

describe('UserService', () => {

    const mockUser = {
        id: 'user-id-1', name: 'Admin', email: 'admin@boldstock.com',
        password: 'hash', role: 'ADMIN' as const, createdAt: new Date()
    };

    it('deve lançar erro se email já cadastrado', async () => {
        prismaMock.user.findUnique.mockResolvedValue(mockUser);

        const service = new UserService();

        await expect(
            service.create({ name: 'Outro', email: 'admin@boldstock.com', password: '123' })
        ).rejects.toThrow('Email ja cadastrado');
    });

    it('deve lançar erro ao tentar deletar usuário não encontrado', async () => {
        prismaMock.user.findUnique.mockResolvedValue(null);

        const service = new UserService();

        await expect(
            service.delete('id-inexistente')
        ).rejects.toThrow('Usuário não encontrado');
    });

    it('deve lançar erro ao tentar deletar usuário ADMIN', async () => {
        prismaMock.user.findUnique.mockResolvedValue(mockUser);

        const service = new UserService();

        await expect(
            service.delete('user-id-1')
        ).rejects.toThrow('Não é permitido deletar um usuário com função ADMIN');
    });

    it('deve lançar erro ao deletar único ADMIN do sistema', async () => {
        prismaMock.user.findUnique.mockResolvedValue({
            ...mockUser, role: 'VENDEDOR' as const
        });
        prismaMock.user.count.mockResolvedValue(1);

        const service = new UserService();

        await expect(
            service.delete('user-id-1')
        ).rejects.toThrow('Não é possível deletar o único ADMIN do sistema');
    });

    it('deve lançar erro ao promover para ADMIN via update', async () => {
        prismaMock.user.findUnique.mockResolvedValue(mockUser);

        const service = new UserService();

        await expect(
            service.update('user-id-1', { role: 'ADMIN' })
        ).rejects.toThrow('Não é permitido promover usuário para ADMIN por essa rota');
    });

    it('deve lançar erro ao atualizar usuário não encontrado', async () => {
        prismaMock.user.findUnique.mockResolvedValue(null);

        const service = new UserService();

        await expect(
            service.update('id-inexistente', { name: 'Novo Nome' })
        ).rejects.toThrow('Usuário não encontrado');
    });
    it('deve criar usuário com sucesso', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({
        id: 'user-id-2', name: 'Vendedor', email: 'vendedor@boldstock.com', role: 'VENDEDOR'
    } as any);

    const service = new UserService();
    const result = await service.create({
        name: 'Vendedor', email: 'vendedor@boldstock.com', password: 'Senha@123'
    });

    expect(result.message).toBe('Usuário criado com sucesso');
});

it('deve listar usuários com sucesso', async () => {
    prismaMock.user.findMany.mockResolvedValue([mockUser]);

    const service = new UserService();
    const result = await service.listAll();

    expect(result.message).toBe('Usuários listados com sucesso');
    expect(result.data).toHaveLength(1);
});

it('deve deletar usuário com sucesso', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ ...mockUser, role: 'VENDEDOR' as const });
    prismaMock.user.count.mockResolvedValue(2);
    prismaMock.user.delete.mockResolvedValue({} as any);

    const service = new UserService();
    const result = await service.delete('user-id-1');

    expect(result.message).toBe('Usuário deletado com sucesso');
});
it('deve atualizar usuário com sucesso', async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    prismaMock.user.update.mockResolvedValue({ ...mockUser, name: 'Admin Atualizado' } as any);

    const service = new UserService();
    const result = await service.update('user-id-1', { name: 'Admin Atualizado' });

    expect(result.message).toBe('Usuário atualizado com sucesso');
});

it('deve lançar erro ao listar usuários vazio', async () => {
    prismaMock.user.findMany.mockResolvedValue([]);

    const service = new UserService();

    await expect(service.listAll()).rejects.toThrow('Nenhum usuário encontrado');
});
});