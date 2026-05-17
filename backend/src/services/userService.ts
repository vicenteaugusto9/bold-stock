import { hash } from 'bcrypt';
import prisma from '../lib/prisma';
import { Role } from '../generated/prisma';

interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    role?: Role;
}

interface ServiceResponse<T> {
    data: T;
    message: string;
}

export class UserService {
    async create({ name, email, password, role }: CreateUserDTO): Promise<ServiceResponse<object>> {
        const userAlreadyExists = await prisma.user.findUnique({
            where: { email }
        });

        if (userAlreadyExists) {
            throw new Error("Email ja cadastrado");
        }

        const hashedPassword = await hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role ?? 'VENDEDOR'
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        return { data: user, message: "Usuário criado com sucesso" };
    }

    async listAll(): Promise<ServiceResponse<object[]>> {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        if (users.length === 0) {
            throw new Error("Nenhum usuário encontrado");
        }

        return { data: users, message: "Usuários listados com sucesso" };
    }

    async update(id: string, data: Partial<CreateUserDTO>): Promise<ServiceResponse<object>> {
        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        // ✅ Melhoria 2: bloqueia promoção para ADMIN por essa rota
        if (data.role === 'ADMIN') {
            throw new Error("Não é permitido promover usuário para ADMIN por essa rota");
        }

        if (data.password) {
            data.password = await hash(data.password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        return { data: updatedUser, message: "Usuário atualizado com sucesso" };
    }

    async delete(id: string): Promise<ServiceResponse<null>> {
        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        if (user.role === 'ADMIN') {
            throw new Error("Não é permitido deletar um usuário com função ADMIN");
        }

        // garante que sempre existe pelo menos um ADMIN no sistema
        const adminCount = await prisma.user.count({
            where: { role: 'ADMIN' }
        });

        if (adminCount <= 1) {
            throw new Error("Não é possível deletar o único ADMIN do sistema");
        }

        await prisma.user.delete({
            where: { id }
        });

        //  retorno padronizado
        return { data: null, message: "Usuário deletado com sucesso" };
    }
}