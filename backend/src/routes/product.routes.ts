import { Router } from "express";
import { ProductController, } from "../controllers/ProductController";
import { isAuthenticated } from "../middleware/auth";
import { isAuthorized } from "../middleware/role";

const productRoutes = Router()
const productController = new ProductController

// todos podem acessar 

productRoutes.get('/', isAuthenticated, productController.listAll.bind(productController))
productRoutes.get('/:id',isAuthenticated, productController.findById.bind(productController))


// ADM E ESTOQUISTAS PODEM ACESSAR E GERENCIAR PRODUTOS 

productRoutes.post('/',isAuthenticated,isAuthorized('ADMIN','ESTOQUISTA'),productController.create.bind(productController))
productRoutes.put('/:id',isAuthenticated,isAuthorized('ADMIN','ESTOQUISTA'),productController.update.bind(productController))
productRoutes.patch('/:id/deactivate',isAuthenticated,isAuthorized('ADMIN'),productController.deactivate.bind(productController))

export default productRoutes