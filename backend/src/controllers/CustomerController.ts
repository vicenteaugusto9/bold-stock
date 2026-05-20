import { Request, Response } from "express";
import { CustomerService } from "../services/CustomerService";
import { AppError } from "../shared/errors";



export class CustomerController {
    private customerService: CustomerService

    constructor(){
        this.customerService = new CustomerService
    }


    async create( req: Request, res: Response){
        try{
            const {name, document,email,phone} = req.body   

            if (!name || !document ){
                throw new AppError("name e document sao obrigatorios ", 400)   
            }
            
            const result = await this.customerService.create({name,document,email,phone})
            return res.status(201).json(result)

        } catch (error){
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({error:"Erro interno do servidor"})
            }
        }
    }
    async listAll(req: Request , res: Response){
        try{
            const result = await this.customerService.listAll()
            res.status(200).json(result)
            
        } catch (error){
            if (error instanceof AppError){
                return res.status(error.statusCode).json({error: error.message})
            }

            return res.status(500).json({error:'Erro interno do servidor'})
        }
    }

    async findById (req:Request , res:Response){
        try {
            const id = req.params.id as string
            const result = this.customerService.findById(id)
            return res.status(200).json(result)
        } catch (error){
            if (error instanceof AppError){
                return res.status(error.statusCode).json({error:error.message})
            }
            return res.status(500).json({error:'Erro interno do servidor '})
        }
    }

    async update (req:Request, res: Response){
        try {
            const id = req.params.id as string
            const {name,document,email,phone} = req.body
    
            const result =  await this.customerService.update(id,{name,document,email,phone})
            return res.status(200).json(result)

        } catch (error){
            if (error instanceof AppError){
                return res.status(error.statusCode).json({error:error.message})
            }

            return res.status(500).json({error:'Erro interno do servidor '})
        }
    }

    async deactivate (req:Request,res:Response){
        try{
            const id = req.params.id as string

            if (!id){
                throw new AppError("ID e obrigatorio",400)
            }

            const result = await this.customerService.deactivate(id)
            return res.status(200).json(result)

        } catch (error){
            if (error instanceof AppError){
                return res.status(error.statusCode).json({error:error.message})
            }

            return res.status(500).json({error:'Erro interno do servidor '})
        }
        
    }
}  