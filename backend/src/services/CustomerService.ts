import prisma from "../lib/prisma";
import { AppError } from "../shared/errors";

interface CreateCustomerDTO {
    name: string
    document : string // CPF OU CNPJ
    email?: string
    phone?: string
}

export class CustomerService {

    async create({name, document,email,phone}: CreateCustomerDTO){
        const documentAlreadyExists = await prisma.customer.findUnique({
            where:{document}

        })

        if (documentAlreadyExists){
            throw new AppError("CPF/CNPJ ja cadastrado", 409)
        }
        if (email){
            const emailAlreadyExists = await prisma.customer.findUnique({
                where:{email}
            })


            if (emailAlreadyExists){
                throw new AppError("Email ja cadastardo", 409)
            }
        }
        const customer = await prisma.customer.create({
            data:{name,document,email,phone}
        })

        return {data: customer, message:"Cliente criado com sucesso "}
    }

    async listAll(){

        const customers =  await prisma.customer.findMany({
                select:{
                    id: true,
                    name: true,
                    document:true,
                    email: true,
                    phone: true
                }
              })
              if(customers.length === 0){
                throw new AppError("Nenhum cliente encontrado",400)
              }

              return {data: customers, message:"Clientes listados com sucesso"}
    }

    async findById(id: string){
        const customer = await prisma.customer.findUnique({
            where:{id},
            select:{
                id: true,
                name: true,
                document: true,
                email: true,
                phone: true
            }
        })

        if (!customer){
            throw new AppError("Cliente nao encontrado", 404)
        }

        return {data: customer, message:"Cliente encontrado"}
    }

    async update(id:string, data: Partial<CreateCustomerDTO>){
         const customer = await prisma.customer.findUnique({
            where:{id}
         })

         if (!customer){
            throw new AppError("Cliente nao encontrado",404)
         }

         if(data.document && data.document !== customer.document){
            const documentAlreadyExists = await prisma.customer.findUnique({
                where:{document: data.document}
            })

            if(documentAlreadyExists){
                throw new AppError("CPF/CNPJ ja cadastrado", 409)
            }
         }

         if(data.email && data.email !== customer.email){
            const emailAlreadyExists = await prisma.customer.findUnique({
                where:{email: data.email}
            })

            if(emailAlreadyExists){
                throw new AppError("Email ja cadastrado ", 409)
            }
         }

         if ( !data.name && !data.document && !data.email && !data.phone){
            throw new AppError("Informe ao menos um campo para atualizar", 400)
         }

         const updated = await prisma.customer.update({
            where:{id},
            data,
            select:{
                id: true,
                name: true,
                document: true,
                email: true,
                phone: true
            }
         })

         return {data: updated, message: " Cliente atualizado com sucesso "}
    }

    async delete(id:string){
        const customer = await prisma.customer.findUnique({
            where:{id},
            include : {
                _count: {select: {sales: true}}
            }
        })

        if(!customer) {
            throw new AppError("Cliente nao encontrado", 404)
        }

        // se cliente conter vendas vinculadoas , nao sera possivel deletatr o mesmo 

        if (customer._count.sales > 0) {
            throw new AppError ("Cliente possui vendas vinculadas e nao pode ser deletado", 409)
        }

        await prisma.customer.delete({where:{id}})

        return {data: null , message:"Cliente deletado com sucesso"}
    }
}