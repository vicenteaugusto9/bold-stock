import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";
import { error } from "node:console";

export class ProductController{
    private productService: ProductService

    constructor(){
        this.productService = new ProductService()
    }

    async create(req: Request, res: Response){
        try {
            const {name, sku, price, costPrice, unit, categoryId, initialStock } = req.body

            if(!name || !sku || !price || !costPrice || !categoryId){
                return res.status(400).json({error:"name , sku , price , costPrice  e categoryId sao obrigatorios"})
            }

            const result = await this.productService.create({name,sku,price,costPrice,unit,categoryId,initialStock})
            return res.status(201).json(result)
        } catch (error: any){
            if (error.message === 'SKU ja cadastrado'){
                res.status(409).json({error:error.message})
            }

            if (error.message === 'Categoria nao encontrada'){
                return res.status(404).json({error: error.message})
            }

            return res.status(500).json({error: " Erro interno do servidor "})
        }
    }

    async listAll(req:Request, res: Response){
        try{
            const result = await this.productService.listAll();
            return res.status(200).json(result)

        } catch (error: any) {
            if (error.message === 'Nenhum produto encontrado'){
                return res.status(404).json({error: error.message})

            }
            return res.status(500).json({error:'Erro interno do servidor '})
        }
    }
    async findById(req:Request,res:Response){
        try{
            const id = req.params.id as string
            const result = await this.productService.findById(id)
            return res.status(200).json(result)

        } catch (error: any){
            if (error.message === 'Produto nao encontrado'){
                return res.status(404).json({error:error.message})
            }

            return res.status(500).json({error:'Erro interno no servidor '})
        }
    }
    async update( req:Request, res : Response){
        try{
            const id = req.params.id as string
            const {name,sku,price,costPrice,unit,categoryId} = req.body

            if (!name && !sku && !price && !costPrice && !unit && !categoryId ){
                return res.status(400).json({error:'Informe ao menos um campo para atualizar'})
            }
            const result = await this.productService.update(id,{name,sku,price,costPrice,unit, categoryId})
                return res.status(200).json(result)
        } catch (error:any){
            if (error.message === 'produto nao encontrado'){
                return res.status(404).json({error:error.message})
                
            }

            if (error.message === 'SKU ja cadastrado'){
                return res.status(409).json({error:error.message})
            }
            if (error.message === ' Categoria nao encontrada'){
                return res.status(404).json({error:error.message})
            }

        }
        return res.status(500).json({error:'erro interno do servidor '})

    }

    async deactivate(req:Request, res: Response){
        try{
            const id = req.params.id as string 
            const result = await this.productService.deactivate(id)
            return res.status(200).json(result)

        } catch (error:any){
            if (error.message === 'produto nao encontrado'){
                return res.status(404).json({error:error.message})
            }
            if(error.message === 'Categoria nao encontrada'){
                return res.status(409).json({error:error.message})
            }

            return res.status(500).json({error:'Erro interno do servidor '})
        }
    }
}

