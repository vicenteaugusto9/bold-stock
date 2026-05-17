import {compare} from 'bcrypt';
import {sign} from 'jsonwebtoken';
import prisma from '../lib/prisma';


interface AuthenticateUserDTO {
    email: string;
    password: string;
}

export class AuthenticateUserService {
    async execute({ email, password }: AuthenticateUserDTO) {
        // Verificar se o usuário existe
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            throw new Error("Usuário ou senha incorretos");
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new Error("Usuário ou senha incorretos");
        }
        // Se o usuário existir e a senha estiver correta, gerar um token JWT
        // O PRIMEIRO PARÂMETRO DO SIGN É O PAYLOAD, ONDE VOCÊ PODE INCLUIR INFORMAÇÕES QUE DESEJA QUE ESTEJAM DISPONÍVEIS NO TOKEN
        // SEGUNDO PARÂMETRO É A CHAVE SECRETA PARA ASSINAR O TOKEN, QUE DEVE SER ARMAZENADA EM UMA VARIÁVEL DE AMBIENTE PARA SEGURANÇA
        // O TERCEIRO PARÂMETRO SÃO AS OPÇÕES, ONDE VOCÊ PODE DEFINIR O "SUBJECT" DO TOKEN (GeralMENTE O ID DO USUÁRIO) E O TEMPO DE EXPIRAÇÃO DO TOKEN (QUE É IMPORTANTE PARA SEGURANÇA, POIS EVITA QUE O TOKEN SEJA USADO INDEFINIDAMENTE)
        const token = sign(
            { role: user.role }, // Payload do token, aqui você pode incluir outras informações se necessário
            process.env.JWT_SECRET as string, // Chave secreta para assinar o token, deve ser armazenada em uma variável de ambiente
            {
                subject: user.id, // O ID do usuário é definido como o "subject" do token
                expiresIn: '1d' // O token expira em 1 dia
            }
        ); 
        // Retornar os dados do usuário e o token
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        }
     }
}