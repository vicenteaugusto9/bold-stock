import { Request, Response } from "express";
import { UserService } from "../services/userService";

export class UserController {
  // ✅ Melhoria 1: instancia uma única vez
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async create(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;

      // ✅ Melhoria 4: validação básica de entrada
      if (!name || !email || !password) {
        return res.status(400).json({ error: "name, email e password são obrigatórios" });
      }

      const result = await this.userService.create({ name, email, password, role });
      return res.status(201).json(result);

    } catch (error: any) {
      // ✅ Melhoria 2: status codes corretos
      if (error.message === "Email ja cadastrado") {
        return res.status(409).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async listAll(req: Request, res: Response) {
    try {
      const result = await this.userService.listAll();
      return res.status(200).json(result);

    } catch (error: any) {
      if (error.message === "Nenhum usuário encontrado") {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async update(req: Request, res: Response) {
    try {
        const id = req.params.id as string;
        const { name, email, password, role } = req.body;

        if (!name && !email && !password && !role) {
            return res.status(400).json({ error: "Informe ao menos um campo para atualizar" });
        }

        const result = await this.userService.update(id, { name, email, password, role });
        return res.status(200).json(result);

    } catch (error: any) {
        if (error.message === "Usuário não encontrado") {
            return res.status(404).json({ error: error.message });
        }
        if (error.message.includes("promover")) {
            return res.status(403).json({ error: error.message });
        }
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}

async delete(req: Request, res: Response) {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ error: "ID do usuário é obrigatório" });
        }

        const result = await this.userService.delete(id as string); // ← cast aqui, depois da validação
        return res.status(200).json(result);

    } catch (error: any) {
        if (error.message === "Usuário não encontrado") {
            return res.status(404).json({ error: error.message });
        }
        if (error.message.includes("ADMIN")) {
            return res.status(403).json({ error: error.message });
        }
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}