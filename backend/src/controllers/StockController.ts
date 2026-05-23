import { Request , Response } from "express";
import { StockService } from "../services/Stockservice";
import { AppError } from "../shared/errors";

export class StockController {
    private stockService : StockService

    constructor(){
        this.stockService = new StockService()
    }


    async getByProduct(req:Request, res: Response){
        try{
             const {productId} = req.params 
             const result = await this.stockService.getByProduct(productId as string)
             return res.status(200).json(result)
        } catch (error){
            if( error instanceof AppError){
                return res.status(error.statusCode).json({error:error.message})
            }

            return res.status(500).json({error:'Erro interno do servidor'})
        }
    }


    async listLowStock(req:Request, res:Response){
        try{
            const limit = req.query.limit ? Number(req.query.limit) : 10 
            const result = await this.stockService.listLowStock(limit)
            return res.status(200).json(result)
        } catch (error){
            if(error instanceof AppError){
                return res.status(error.statusCode).json({error:error.message})
            }

            return res.status(500).json({error:'Erro interno do servidor'})
        }
    }

    async addEntry(req: Request, res:Response){
        try {
            const {productId , quantity , correlationId} = req.body 

            if ( !productId || !quantity){
                throw new AppError("productId e quantity são obrigatórios",400)
            }

            const result = await this.stockService.addEntry({productId,quantity,correlationId})

            return res.status(200).json(result)
        } catch (error){
            if (error instanceof AppError){
                return res.status(error.statusCode).json({error:error.message})
            }

            return res.status(500).json({error:"Erro interno do servidor"})
        }
    }

    async adJustment(req:Request,res:Response){

        try{
            const {productId , quantity , correlationId} = req.body 
   
               if ( !productId || !quantity === undefined){
                   throw new AppError("productId e quantity são obrigatórios",400)
               }
   
               const result = await this.stockService.adJustment({productId,quantity,correlationId})
               return res.status(200).json(result)
       } catch (error){
        if (error instanceof AppError){
            return res.status(error.statusCode).json({error:error.message})
        }

        return res.status(500).json({error:'Erro interno do servidor '})
       }

    }

    async getMovements(req:Request,res:Response){
        try{

            const {productId} = req.params
            const result = await this.stockService.getMovements(productId as string)

            return res.status(200).json(result)
        } catch (error){
            if (error instanceof AppError){
                return res.status(error.statusCode).json({error:error.message})
            }

            return res.status(500).json({error:'Erro interno do servidor'})
        }
    }
}