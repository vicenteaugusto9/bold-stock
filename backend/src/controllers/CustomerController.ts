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
}  