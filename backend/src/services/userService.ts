import { hash } from 'bcrypt';
import prisma from '../lib/prisma';
import { Role } from '../generated/prisma';

// typeimport { Role } from '../generated/prisma';
//  Role = 'ESTOQUISTA' | 'ADMIN' | 'VENDEDOR';

interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    role?: Role; 
}

export class UserService {
    async create({ name, email, password, role }: CreateUserDTO) {

        const userAlreadyExists = await prisma.user.findUnique({
            where: {
                email
            }
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
                role: role ?? 'VENDEDOR' // Agora o '??' funciona perfeitamente!
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });
        
        return user;
    }
    async list() {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }     });

            if (users.length === 0) {
                throw new Error("Nenhum usuário encontrado");
            }  
        return users;
    }

    async update(id: string, data: Partial<CreateUserDTO>) {
        const user = await prisma.user.findUnique({
            where: {
                id
            },
        });

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        if (data.password) {
            data.password = await hash(data.password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: {
                id
            },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        return updatedUser;
    }
}