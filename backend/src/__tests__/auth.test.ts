/// <reference types="jest" />

jest.mock('../lib/prisma', () => ({
    __esModule: true,
    default: require('./helpers/prismaMock').default
}));

import prismaMock from './helpers/prismaMock';
import { AuthenticateUserService } from '../services/AuthenticateUserService';
import { hash } from 'bcrypt';

beforeEach(() => { jest.clearAllMocks(); });

describe('AuthenticateUserService', () => {

    it('deve autenticar com email e senha corretos', async () => {
        const hashedPassword = await hash('Admin@123', 10);
        prismaMock.user.findUnique.mockResolvedValue({
            id: 'user-id-1', name: 'Administrador',
            email: 'admin@boldstock.com', password: hashedPassword,
            role: 'ADMIN', createdAt: new Date()
        });

        const service = new AuthenticateUserService();
        const result = await service.execute({
            email: 'admin@boldstock.com', password: 'Admin@123'
        });

        expect(result).toHaveProperty('token');
        expect(result.user.email).toBe('admin@boldstock.com');
    });

    it('deve lançar erro se usuário não existir', async () => {
        prismaMock.user.findUnique.mockResolvedValue(null);
        const service = new AuthenticateUserService();

        await expect(
            service.execute({ email: 'naoexiste@email.com', password: '123' })
        ).rejects.toThrow('Usuário ou senha incorretos');
    });

    it('deve lançar erro se senha estiver errada', async () => {
        const hashedPassword = await hash('SenhaCorreta@123', 10);
        prismaMock.user.findUnique.mockResolvedValue({
            id: 'user-id-1', name: 'Admin',
            email: 'admin@boldstock.com', password: hashedPassword,
            role: 'ADMIN', createdAt: new Date()
        });

        const service = new AuthenticateUserService();

        await expect(
            service.execute({ email: 'admin@boldstock.com', password: 'SenhaErrada@123' })
        ).rejects.toThrow('Usuário ou senha incorretos');
    });
});