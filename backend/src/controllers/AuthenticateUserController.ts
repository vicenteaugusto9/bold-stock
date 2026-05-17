import { Request ,Response } from "express";
import {AuthenticateUserService}  from "../services/AuthenticateUserService";


export class AuthenticateUserController {
    async handle(req: Request, res: Response) {
        const { email, password } = req.body;

        // Criar uma instância do serviço de autenticação
        const authenticateUserService = new AuthenticateUserService();

        try {
            // Chamar o método execute do serviço de autenticação
            const result = await authenticateUserService.execute({
                 email,
                 password 
                });

            // Retornar a resposta com os dados do usuário e o token
                return res.status(200).json(result);

        } catch (error: any) {
            return res.status(401).json({ error: error.message });      
        }
     }
}
