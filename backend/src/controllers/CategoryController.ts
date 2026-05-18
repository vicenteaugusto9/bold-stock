import { Request, Response } from "express";
import { CategoryService } from "../services/CategorySevice";

export class CategoryController {
    private categoryService: CategoryService;

    constructor() {
        this.categoryService = new CategoryService();
    }

    async create(req: Request, res: Response) {
        try {
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ error: "Nome da categoria é obrigatório" });
            }

            const result = await this.categoryService.createCategory({ name });
            return res.status(201).json(result);
        } catch (error: any) {
            if (error.message === "Categoria já cadastrada") {
                return res.status(409).json({ error: error.message });
            }
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}