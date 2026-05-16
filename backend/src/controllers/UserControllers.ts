import { Request, Response } from "express";
import { UserService } from "../services/userService";

export class UserController {
  async create(req: Request, res: Response) {
    try {
      // Extraímos os dados do corpo da requisição
        const { name, email, password, role } = req.body;
        // Criamos uma instância do UserService
        const userService = new UserService();
        // Chamamos o método create do UserService, passando os dados extraídos
        const user = await userService.create({ name, email, password, role });
        // Retornamos a resposta com o usuário criado
        return res.status(201).json(user);
    } catch (error: any) {
          // Em caso de erro, retornamos uma resposta de erro
         return res.status(400).json({ error: error.message });
    }
  }
}

