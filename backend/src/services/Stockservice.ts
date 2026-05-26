 import prisma  from "../lib/prisma";
 import { AppError } from "../shared/errors"; 

 interface StockMovementDTO {
    productId: string
    type :'ENTRY' | 'EXIT' | 'RESERVE' | 'RELEASE' | 'ADJUSTMENT' 
    quantity : number
    correlationId?: string
 }

 export class StockService {
    
       async getByProduct(productId:string){
            const stock = await prisma.stock.findUnique({
                where:{productId},
                include :{
                    product: {
                        select: {id:true, name: true ,sku : true , unit : true}
                    },
                    movements :{
                        orderBy: {createdAt : 'desc'},
                        take: 10
                    }
                }
            })


            if (!stock){
                throw new AppError('Estoque nao encontrado para este produto', 404)
            }

            return {data: stock , message: 'Estoque encontrado'}
       }
       /// LISTA DE PRODUTOS COM BAIXO ESTOQUE , feat: adicionar no dashboard do front...
       async listLowStock (limit = 10){

                const stocks = await prisma.stock.findMany({
                    where:{
                        available :{lte: limit},
                        product: {active:true}
                    },
                    include:{
                         product:{
                            select:{
                                id : true ,
                                name : true,
                                sku : true,
                                unit : true
                            }
                         }
                    },
                    orderBy:{
                        available: 'asc'
                    }
                })

                return {data: stocks , message: 'Produtos com estoque baixo '}
         
       }

       async addEntry({productId, quantity , correlationId }: Omit<StockMovementDTO, 'type'>){

            if (quantity <= 0){
                throw new AppError('Quantidade deve ser maior que zero', 400)
            }

            const stock = await prisma.stock.findUnique({
                where:{productId}
            })

            if(!stock){
                throw new AppError('Estoque nao encontrado para este produto',404)
            }

            const result = await prisma.$transaction( async (tx) =>{
                const updated = await prisma.stock.update({
                    where: {productId},
                    data:{
                        available:{
                            increment: quantity
                        }
                    }
                }) 

                await tx.stockMovement.create({
                    data:{
                        stockId: stock.id,
                        type: 'ENTRY',
                        quantity,
                        correlationId
                    }
                })
                return updated
            })

            return {data: result, message:`Entrada de ${quantity} unidades registradas`}

       }

       async reserve({productId, quantity,correlationId}: Omit<StockMovementDTO,'type'>){
            if (quantity <= 0){
                throw new AppError('Quantidade deve ser maior que zero', 400)
            }

            const stock = await prisma.stock.findUnique({
                where:{productId}
            })

             if(!stock){
                throw new AppError('Estoque nao encontrado',404)
            }

            // VALIDA SE TEM ESTOQUE DISPONIVEL ANTES DE RESERVAR

            if (stock.available < quantity){
                throw new AppError(`Estoque insuficiente - disponivel: ${stock.available}, solicitado: ${quantity}`, 409)
            }

            const result = await prisma.$transaction( async (tx) => {
                const updated = await tx.stock.update({
                    where:{productId},
                    data:{
                        available:{decrement:quantity},
                        reserved: {increment: quantity}
                    }
                })

                await tx.stockMovement.create({
                    data:{
                        stockId: stock.id,
                        type: 'RESERVE',
                        quantity,
                        correlationId
                    }
                })

                return updated
            })

            return {data: result, message: `${quantity} unidades reservadas`}
            
       }    

       async confirmExit ({productId, quantity, correlationId}: Omit<StockMovementDTO,'type'>){
            
            const stock = await prisma.stock.findUnique({
                where:{productId}
            })

            if (!stock){
                throw new AppError('Estoque nao encontrado',404)
            }

            if (stock.reserved < quantity){
                throw new AppError('Quantidade reservada insuficiente para confirmar saida', 409)
            }

            const result = await prisma.$transaction(async (tx) =>{
                const updated = await tx.stock.update({
                    where:{productId},
                    data:{
                        reserved:{decrement:quantity}
                    }

                })
                
                await tx.stockMovement.create({
                    data:{
                        stockId : stock.id,
                        type: 'EXIT',
                        quantity,
                        correlationId
                    }
                })

                return updated
            })

            return {data: result , message: `Saida de ${quantity} unidades confirmada`}

       }

       async release({productId , quantity , correlationId}: Omit<StockMovementDTO, 'type'>){
            const stock = await prisma.stock.findUnique({
                where:{productId}
            })

            if (!stock){
                throw new AppError('Estoque nao encontrado',404)
            }

            if (stock.reserved < quantity){
                throw new AppError(' Quantidade reservada insuficiente para liberar', 409)
            }

            const result = await prisma.$transaction( async (tx) =>{
                const updated = await tx.stock.update({
                    where:{productId},
                    data:{
                        available:{increment:quantity},
                        reserved:{decrement:quantity}
                    }

                })

                await tx.stockMovement.create({
                    data:{
                        stockId: stock.id,
                        type:'RELEASE',
                        quantity,
                        correlationId
                    }
                })

                return updated
            })

            return {data: result , message: `${quantity} unidades liberadas de volta ao estoque `}
       }

       async adJustment ({productId, quantity,correlationId}: Omit<StockMovementDTO,'type'>){
             const stock = await prisma.stock.findUnique({
                where:{productId}
            })

            if (!stock){
                throw new AppError('Estoque nao encontrado',404)
            }

            if(quantity < 0){
                throw new AppError('Quantidade de ajuste nao pode ser negativa', 400)
            }

            const result = await prisma.$transaction(async (tx) =>{
                const updated = await tx.stock.update({
                    where:{productId},
                    data:{
                        available:quantity
                    }
                })

                await tx.stockMovement.create({
                    data:{
                        stockId: stock.id,
                        type:'ADJUSTMENT',
                        quantity,
                        correlationId
                    }
                })

                return updated
            })

            return {data: result , message: `Estoque ajustado para ${quantity} unidades`}
       }

       async getMovements (productId : string){
          const stock = await prisma.stock.findUnique({
                where:{productId}
            })

            if (!stock){
                throw new AppError('Estoque nao encontrado',404)
            }

            const movements = await prisma.stockMovement.findMany({
                where:{stockId:stock.id},
                orderBy:{createdAt:'desc'}
            })

            return {data: movements , message: 'Movimentacoes encontradas '}
       }
 }
 /// service de soft lock e criacao de logica de movimentacoes dentro do sistema