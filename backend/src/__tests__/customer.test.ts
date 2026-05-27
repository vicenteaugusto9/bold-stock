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
    it('deve criar cliente com sucesso', async () => {
    prismaMock.customer.findUnique.mockResolvedValue(null);
    prismaMock.customer.create.mockResolvedValue({
        id: 'cust-id-1', name: 'Maria', document: '52998224725',
        email: null, phone: null, active: true, createdAt: new Date()
    });

    const service = new CustomerService();
    const result = await service.create({ name: 'Maria', document: '529.982.247-25' });

    expect(result.message).toBe('Cliente criado com sucesso ');
});

it('deve buscar cliente por id com sucesso', async () => {
    prismaMock.customer.findUnique.mockResolvedValue(mockCustomer);

    const service = new CustomerService();
    const result = await service.findById('cust-id-1');

    expect(result.message).toBe('Cliente encontrado');
});

it('deve desativar cliente com sucesso', async () => {
    prismaMock.customer.findUnique.mockResolvedValue(mockCustomer);
    prismaMock.sale.count.mockResolvedValue(0);
    prismaMock.customer.update.mockResolvedValue({} as any);

    const service = new CustomerService();
    const result = await service.deactivate('cust-id-1');

    expect(result.message).toBe('Cliente desativado com sucesso');
});
it('deve listar clientes com sucesso', async () => {
    prismaMock.customer.findMany.mockResolvedValue([mockCustomer]);

    const service = new CustomerService();
    const result = await service.listAll();

    expect(result.message).toBe('Clientes listados com sucesso');
});

it('deve lançar erro se nenhum cliente encontrado', async () => {
    prismaMock.customer.findMany.mockResolvedValue([]);

    const service = new CustomerService();

    await expect(service.listAll()).rejects.toThrow('Nenhum cliente encontrado');
});

it('deve lançar erro se email já cadastrado no create', async () => {
    prismaMock.customer.findUnique
        .mockResolvedValueOnce(null)     // documento não existe
        .mockResolvedValueOnce(mockCustomer); // email já existe

    const service = new CustomerService();

    await expect(
        service.create({ name: 'Teste', document: '529.982.247-25', email: 'admin@boldstock.com' })
    ).rejects.toThrow('Email ja cadastardo');
});

it('deve atualizar cliente com sucesso', async () => {
    prismaMock.customer.findUnique.mockResolvedValue(mockCustomer);
    prismaMock.customer.update.mockResolvedValue({ ...mockCustomer, phone: '(85) 99999-0000' });

    const service = new CustomerService();
    const result = await service.update('cust-id-1', { phone: '(85) 99999-0000' });

    expect(result.message).toBe(' Cliente atualizado com sucesso ');
});

it('deve lançar erro ao atualizar com documento inválido', async () => {
    prismaMock.customer.findUnique.mockResolvedValue(mockCustomer);

    const service = new CustomerService();

    await expect(
        service.update('cust-id-1', { document: '111.111.111-11' })
    ).rejects.toThrow('Novo CPF ou CNPJ informado é inválido');
});

it('deve lançar erro ao atualizar com email já cadastrado', async () => {
    prismaMock.customer.findUnique
        .mockResolvedValueOnce(mockCustomer)   // cliente existe
        .mockResolvedValueOnce(mockCustomer);  // email já existe

    const service = new CustomerService();

    await expect(
        service.update('cust-id-1', { email: 'admin@boldstock.com' })
    ).rejects.toThrow('Email ja cadastrado ');
});


});