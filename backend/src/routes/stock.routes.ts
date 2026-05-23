import { Router } from "express";
import { isAuthenticated } from "../middleware/auth";
import { isAuthorized } from "../middleware/role";
import { StockController } from "../controllers/StockController";


const stockRoutes = Router ()
const stockcontroller = new StockController

// rotas de ver - ADM E ESTOQUISTA  

stockRoutes.get('/low',isAuthenticated,isAuthorized('ADMIN','ESTOQUISTA'),stockcontroller.listLowStock.bind(stockcontroller))
stockRoutes.get('/:productId',isAuthenticated,isAuthorized('ADMIN','ESTOQUISTA'),stockcontroller.getByProduct.bind(stockcontroller))
stockRoutes.get('/productId/movements',isAuthenticated,isAuthorized('ADMIN','ESTOQUISTA'),stockcontroller.getMovements.bind(stockcontroller))


// rotas de movimentar estoque ADM E ESTOQUISTA 

stockRoutes.post('/entry',isAuthenticated,isAuthorized('ADMIN','ESTOQUISTA'),stockcontroller.addEntry.bind(stockcontroller))
stockRoutes.post('/adjusment',isAuthenticated,isAuthorized('ADMIN','ESTOQUISTA'),stockcontroller.adJustment.bind(stockcontroller))


export default stockRoutes