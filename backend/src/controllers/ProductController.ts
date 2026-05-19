import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";
// REFACT: Removido o import não utilizado de 'node:console'.

export class ProductController {
    private productService: ProductService;

    constructor() {
        this.productService = new ProductService();
    }

    async create(req: Request, res: Response) {
        // REFACT: Removemos todo o bloco try/catch. Se o service lançar um AppError, 
        // o pacote 'express-async-errors' intercepta e joga direto para o Middleware Global.
        const { name, sku, price, costPrice, unit, categoryId, initialStock } = req.body;

        if (!name || !sku || !price || !costPrice || !categoryId) {
            return res.status(400).json({ error: "name, sku, price, costPrice e categoryId sao obrigatorios" });
        }

        const result = await this.productService.create({ name, sku, price, costPrice, unit, categoryId, initialStock });
        return res.status(201).json(result);
    }

    async listAll(req: Request, res: Response) {
        // REFACT: Sem try/catch. Código focado apenas em pedir os dados e responder 200.
        const result = await this.productService.listAll();
        return res.status(200).json(result);
    }

    async findById(req: Request, res: Response) {
        // REFACT: Eliminada a checagem manual por strings idênticas. Se não achar, o Service 
        // responde o erro de forma autônoma e o controller fica limpo.
        const id = req.params.id as string;
        const result = await this.productService.findById(id);
        return res.status(200).json(result);
    }

    async update(req: Request, res: Response) {
        const id = req.params.id as string;
        const { name, sku, price, costPrice, unit, categoryId } = req.body;

        if (!name && !sku && !price && !costPrice && !unit && !categoryId) {
            return res.status(400).json({ error: 'Informe ao menos um campo para atualizar' });
        }

        const result = await this.productService.update(id, { name, sku, price, costPrice, unit, categoryId });
        return res.status(200).json(result);
        
        // REFACT: Corrigido o bug sutil onde o retorno 500 ficava solto fora do escopo do catch antigo.
    }

    async deactivate(req: Request, res: Response) {
        // REFACT: Removidos os ifs de erro antigos que continham regras copiadas incorretamente, 
        // como checar erro de "Categoria nao encontrada" dentro do método de desativar produto.
        const id = req.params.id as string;
        const result = await this.productService.deactivate(id);
        return res.status(200).json(result);
    }
}