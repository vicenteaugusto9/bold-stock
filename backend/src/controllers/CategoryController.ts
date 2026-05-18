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
    async listAll(req: Request , res: Response) {
        try{
            const result = await this.categoryService.listAllCategories();
            return res.status(201).json(result)

        } catch (error: any){
            if (error.message === "Nenhuma categoria encontrada")
                return res.status(404).json({error:error.message })
        }
        return res.status(500).json({ error: "Erro interno no servidor "}) 
        
    }

    async update( req:Request , res: Response){
        try {
            const id = req.params.id as string; 
            const {name} = req.body

            if (!name) {
                return res.status(400).json({error: "Nome da categoria e obrigatorio"})
            }
            const result = await this.categoryService.updateCategory(id , name)
            return res.status(200).json(result)
    
        } catch (error:any){
            if (error.message === "Categoria nao encontrada") {
                return res.status(404).json({error:error.message})
            }

            return res.status(500).json({error: " Erro interno do servidor "})
            
        }
    }

    async delete( req:Request, res:Response){
        try {
            const id = req.params.id as string 

            if (!id){
                return res.status(400).json({error:" ID e obrigatorio"})
          }
            const result = await this.categoryService.deleteCategory(id)
            return res.status(200).json(result)
        } catch (error: any) {
            if (error.message === "categoria nao encontrada"){
                return res.status(404).json({error: error.message})}
            if (error.message.includes("Vinculados")){
                return res.status(409).json({error:error.message})
            }    
            
           return res.status(500).json({error: "Erro interno do servidor "})

        }
        

    }
}