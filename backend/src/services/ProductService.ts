import prisma from "../lib/prisma";
import { Decimal } from "../generated/prisma/runtime/client";


interface CreateProductDTO {
    name: string ;
    sku : string;
    price: number; 
    costPrice : number
    unit?: string
    categoryId :string
    initialStock?: number
}


export class ProductService {
    
    async create({name,sku,price,costPrice,unit,categoryId,initialStock}: CreateProductDTO){

        const skuAlreadyexists = await prisma.product.findUnique({
            where: {sku}
        })

        if (skuAlreadyexists){
            throw new Error("sku ja cadastrado")

        }
        const categoryExists = await prisma.category.findUnique({
            where: {id: categoryId}
        })

        if (!categoryExists) {
            throw new Error("Categoria nao encontrada")
        }

        // PRODUTO E ESTOQUE CRIADOS NA MESMA TRANSACAO 

        const product = await prisma.$transaction(async(tx) => {
            const newProduct = await tx.product.create({
                data: {
                    name,
                    sku,
                    price,
                    costPrice,
                    unit: unit ?? 'UN',
                    categoryId,
                    stock : {
                        create: {
                            available : initialStock ?? 0,
                            reserved : 0
                        }
                    }

                },
                select : {
                    id: true,
                    name: true,
                    sku: true,
                    price: true ,
                    costPrice: true,
                    unit : true,
                    active : true,
                    category : {select: {id: true, name: true}},
                    stock : {select: { id: true ,available:true , reserved:true}}
                }
            })
            // se tiver estoque inicial , registra a movimentacao 
            if (initialStock && initialStock >0 ){
                await tx.stockMovement.create({
                    data:{
                        stockId: newProduct.stock!.id,
                        type: 'ENTRY',
                        quantity: initialStock,
                    }
                })
            }
            return newProduct
        })
        return {data: product, message:"Produto criado com sucesso"}

    }   

    async listAll(){
        const products = await prisma.product.findMany({
            where: {active: true},
            select: {
                id: true,
                name: true ,
                sku : true,
                price: true,
                costPrice : true ,
                unit: true,
                active:true,
                category: {select:{id: true , name : true}},
                stock : {select :{ available: true , reserved : true}}
            }
        })

        if (products.length === 0){
            throw new Error('Nenhum produto encontrado')
        }

        return {data:products , message:" Produtos listados com sucesso "}
        
    }

    async findById(id: string){
        const product = await prisma.product.findUnique({
            where:{id},
            select:{
                id: true,
                name: true,
                sku: true,
                price: true,
                costPrice: true,
                unit: true,
                active: true,
                category: { select: { id: true, name: true } },
                stock: { select: { available: true, reserved: true } }
            }
        })

        if (!product){
            throw new Error("produto nao encontrado")
        }

        return {data: product, message:'Produto encotrado'}
    }

    async update(id:string , data: Partial <CreateProductDTO>){
        const product = await prisma.product.findUnique({
            where : {id}
        })
        if (!product){
            throw  new Error("Produto nao encotrado")
        }

        // se mudar o sku verificar se o novo ja existe 

        if( data.sku && data.sku !== product.sku){
            const skuAlreadyexists = await prisma.product.findUnique({
                where: {sku:data.sku}
            })

            if (skuAlreadyexists){
                throw new Error('SKU ja cadastrado')
            }
        }
            // se mudar a categoria , validar se categoria existe 

        if (data.categoryId){
            const categoryExists = await prisma.category.findUnique({
                where: {id: data.categoryId}
            })

            if (!categoryExists){
                throw new Error("Categoria nao encontrada")
            }
        }

        const {initialStock, ...updateData} = data

        const updated = await prisma.product.update({
            where: {id},
            data: updateData,
            select: {
                id: true,
                name: true ,
                sku: true,
                price:true,
                costPrice: true,
                unit: true,
                active :true ,
                category :{select:{id: true , name: true}},
                stock: {select:{available: true,reserved: true}}
            }
        })

        return {data: updated, message: 'Produto atualizado  com sucesso '}
        
    }

    async deactivate(id: string){
        const product = await prisma.product.findUnique({
            where: {id}
        })

        if(!product){
            throw new Error('Produto nao encontrado')
        }

        if (!product.active){
            throw new Error(" produto ja esta inativo ")
        }

        const updated = await prisma.product.update({
            where:{id},
            data: {active:false},
            select:{
                id:true,
                name: true,
                active: true
            }
        })

        return {data: updated, message:" Produto desativado com sucesso "}
    }



}