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
}