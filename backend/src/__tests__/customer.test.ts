/// <reference types="jest" />

jest.mock('../lib/prisma', () => ({
    __esModule: true,
    default: require('./helpers/prismaMock').default
}));

import prismaMock from './helpers/prismaMock';
import { CustomerService } from '../services/CustomerService';

beforeEach(() => { jest.clearAllMocks(); });

describe('CustomerService', () => {

    const mockCustomer = {
        id: 'cust-id-1', name: 'Maria', document: '52998224725',
        email: null, phone: null, active: true, createdAt: new Date()
    };

    it('deve lançar erro se CPF inválido', async () => {
        const service = new CustomerService();

        await expect(
            service.create({ name: 'Teste', document: '111.111.111-11' })
        ).rejects.toThrow('CPF ou CNPJ inválido');
    });

    it('deve lançar erro se documento já cadastrado', async () => {
        prismaMock.customer.findUnique.mockResolvedValue(mockCustomer);

        const service = new CustomerService();

        await expect(
            service.create({ name: 'Maria', document: '529.982.247-25' })
        ).rejects.toThrow('CPF/CNPJ ja cadastrado');
    });

    it('deve lançar erro se cliente não encontrado no findById', async () => {
        prismaMock.customer.findUnique.mockResolvedValue(null);

        const service = new CustomerService();

        await expect(
            service.findById('id-inexistente')
        ).rejects.toThrow('Cliente nao encontrado');
    });

    it('deve lançar erro se cliente inativo no findById', async () => {
        prismaMock.customer.findUnique.mockResolvedValue({ ...mockCustomer, active: false });

        const service = new CustomerService();

        await expect(
            service.findById('cust-id-1')
        ).rejects.toThrow('Cliente nao encontrado');
    });

    it('deve lançar erro ao atualizar sem campos', async () => {
        const service = new CustomerService();

        await expect(
            service.update('cust-id-1', {})
        ).rejects.toThrow('Informe ao menos um campo para atualizar');
    });

    it('deve lançar erro ao desativar cliente com vendas', async () => {
        prismaMock.customer.findUnique.mockResolvedValue(mockCustomer);
        prismaMock.sale.count.mockResolvedValue(3);

        const service = new CustomerService();

        await expect(
            service.deactivate('cust-id-1')
        ).rejects.toThrow('Cliente possui vendas vinculadas e nao pode ser desativado');
    });
});