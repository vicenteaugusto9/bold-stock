import prisma from "../lib/prisma";
import { AppError } from "../shared/errors";
import { isValidDocument } from "../shared/validators";

interface CreateCustomerDTO {
    name: string;
    document: string; // CPF OU CNPJ
    email?: string;
    phone?: string;
}

export class CustomerService {

    async create({ name, document, email, phone }: CreateCustomerDTO) {
        // 🚨 NOVO: Validação matemática do CPF/CNPJ antes de ir no banco
        if (!isValidDocument(document)) {
            throw new AppError("CPF ou CNPJ inválido", 400);
        }

        const documentAlreadyExists = await prisma.customer.findUnique({
            where: { document }
        });

        if (documentAlreadyExists) {
            throw new AppError("CPF/CNPJ ja cadastrado", 409);
        }

        if (email) {
            const emailAlreadyExists = await prisma.customer.findUnique({
                where: { email }
            });

            if (emailAlreadyExists) {
                throw new AppError("Email ja cadastardo", 409);
            }
        }

        const customer = await prisma.customer.create({
            data: { name, document, email, phone }
        });

        return { data: customer, message: "Cliente criado com sucesso " };
    }

    async listAll() {
        const customers = await prisma.customer.findMany({
            where: { active: true }, // 💡 AJUSTE: Lista apenas clientes ativos
            select: {
                id: true,
                name: true,
                document: true,
                email: true,
                phone: true
            }
        });

        if (customers.length === 0) {
            throw new AppError("Nenhum cliente encontrado", 404); // 💡 Semanticamente 404 faz mais sentido aqui
        }

        return { data: customers, message: "Clientes listados com sucesso" };
    }

    async findById(id: string) {
        const customer = await prisma.customer.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                document: true,
                email: true,
                phone: true,
                active: true // Trazemos para checar o status
            }
        });

        // 💡 AJUSTE: Se não achar ou se o cliente estiver desativado, retorna 404
        if (!customer || !customer.active) {
            throw new AppError("Cliente nao encontrado", 404);
        }

        return { data: customer, message: "Cliente encontrado" };
    }

    async update(id: string, data: Partial<CreateCustomerDTO>) {
         // 💡 AJUSTE: Validação de body vazio movida para o topo (Fast Fail)
         if (!data.name && !data.document && !data.email && !data.phone) {
            throw new AppError("Informe ao menos um campo para atualizar", 400);
         }

         const customer = await prisma.customer.findUnique({
            where: { id }
         });

         if (!customer || !customer.active) {
            throw new AppError("Cliente nao encontrado", 404);
         }

         // 🚨 NOVO: Se o usuário estiver tentando alterar o documento, valida o novo digitado
         if (data.document && data.document !== customer.document) {
            if (!isValidDocument(data.document)) {
                throw new AppError("Novo CPF ou CNPJ informado é inválido", 400);
            }

            const documentAlreadyExists = await prisma.customer.findUnique({
                where: { document: data.document }
            });

            if (documentAlreadyExists) {
                throw new AppError("CPF/CNPJ ja cadastrado", 409);
            }
         }

         if (data.email && data.email !== customer.email) {
            const emailAlreadyExists = await prisma.customer.findUnique({
                where: { email: data.email }
            });

            if (emailAlreadyExists) {
                throw new AppError("Email ja cadastrado ", 409);
            }
         }

         const updated = await prisma.customer.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                document: true,
                email: true,
                phone: true
            }
         });

         return { data: updated, message: " Cliente atualizado com sucesso " };
    }

    // 💡 AJUSTE: Mudamos de 'delete' para 'deactivate' (Soft Delete)
    async deactivate(id: string) {
        const customer = await prisma.customer.findUnique({
            where: { id }
        });

        if (!customer || !customer.active) {
            throw new AppError("Cliente nao encontrado", 404);
        }

        // Sua lógica perfeita de segurança baseada no Sankhya mantida!
        // (Assumindo que no Prisma Schema a relação se chame 'sales')
        const hasSales = await prisma.sale.count({
            where: { customerId: id }
        });

        if (hasSales > 0) {
            throw new AppError("Cliente possui vendas vinculadas e nao pode ser desativado", 409);
        }

        // Altera a flag para false em vez de rodar o .delete() físico
        await prisma.customer.update({
            where: { id },
            data: { active: false }
        });

        return { data: null, message: "Cliente desativado com sucesso" };
    }
}