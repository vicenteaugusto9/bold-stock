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
    


}