import prisma from "../lib/prisma";
import { Decimal } from "../generated/prisma/runtime/client";
// REFACT: Importamos a nossa classe de erro customizada para centralizar as respostas HTTP.
import { AppError } from "../shared/errors";

interface CreateProductDTO {
    name: string;
    sku: string;
    price: number; 
    costPrice: number;
    unit?: string;
    categoryId: string;
    initialStock?: number;
}

export class ProductService {
    
    async create({name, sku, price, costPrice, unit, categoryId, initialStock}: CreateProductDTO){

        // REFACT: Em produção, mover as checagens para dentro da transação evita que duas 
        // requisições concorrentes idênticas tentem criar o mesmo SKU no exato mesmo milissegundo.
        const product = await prisma.$transaction(async(tx) => {
            
            const skuAlreadyexists = await tx.product.findUnique({
                where: {sku}
            })

            if (skuAlreadyexists){
                // REFACT: Substituído o throw new Error genérico pelo AppError com status 409 (Conflict).
                // Isso diz para o Express que o cliente tentou enviar um dado duplicado.
                throw new AppError("sku ja cadastrado", 409);
            }

            const categoryExists = await tx.category.findUnique({
                where: {id: categoryId}
            })

            if (!categoryExists) {
                // REFACT: Substituído por AppError com status 404 (Not Found).
                // Evita que o erro seja tratado como uma falha interna (500) do servidor.
                throw new AppError("Categoria nao encontrada", 404);
            }

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

            if (initialStock && initialStock > 0 ){
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
            // REFACT: Se o banco não encontrar nenhum produto ativo, o erro agora é mapeado 
            // explicitamente como 404 (Not Found), limpando o fluxo do seu Controller.
            throw new AppError('Nenhum produto encontrado', 404);
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
            // REFACT: Busca por ID inválido ou inexistente agora dispara um erro 404 de forma limpa.
            throw new AppError("produto nao encontrado", 404);
        }

        return {data: product, message:'Produto encotrado'}
    }

    async update(id:string , data: Partial <CreateProductDTO>){
        const product = await prisma.product.findUnique({
            where : {id}
        })
        if (!product){
            // REFACT: Mudança para AppError com status 404 para a tentativa de atualizar item fantasma.
            throw new AppError("Produto nao encotrado", 404);
        }

        if( data.sku && data.sku !== product.sku){
            const skuAlreadyexists = await prisma.product.findUnique({
                where: {sku:data.sku}
            })

            if (skuAlreadyexists){
                // REFACT: SKU em uso por outro produto na atualização retorna status 409 (Conflict).
                throw new AppError('SKU ja cadastrado', 409);
            }
        }
            
        if (data.categoryId){
            const categoryExists = await prisma.category.findUnique({
                where: {id: data.categoryId}
            })

            if (!categoryExists){
                // REFACT: Se a nova categoria informada não existir, barramos com 404.
                throw new AppError("Categoria nao encontrada", 404);
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

        return {data: updated, message: 'Produto updated com sucesso '}
    }

    async deactivate(id: string){
        const product = await prisma.product.findUnique({
            where: {id}
        })

        if(!product){
            // REFACT: Erro tratado devidamente com HTTP 404 caso o ID não bata com nenhum produto.
            throw new AppError('Produto nao encontrado', 404);
        }

        if (!product.active){
            // REFACT: Tentar desativar um produto que já está inativo agora retorna um status 
            // 400 (Bad Request), sinalizando que a requisição tentou realizar uma ação inválida.
            throw new AppError("produto ja esta inativo", 400);
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