import { Router } from "express";   
import { CustomerController } from "../controllers/CustomerController";
import { isAuthenticated } from "../middleware/auth";
import { isAuthorized } from "../middleware/role";


const customerRoutes = Router ()
const customerController = new CustomerController


// ADM E VENDEDOR PODE VER CLIENTES

customerRoutes.get('/',isAuthenticated,isAuthorized('ADMIN','VENDEDOR'),customerController.listAll.bind(customerController))
customerRoutes.get('/:id',isAuthenticated,isAuthorized('ADMIN','VENDEDOR'),customerController.findById.bind(customerController))

// ADM E VENDEDOR PODE CRIAR E ATT CLIENTES 

customerRoutes.post('/',isAuthenticated,isAuthorized('ADMIN','VENDEDOR'),customerController.create.bind(customerController))
customerRoutes.put('/:id',isAuthenticated,isAuthorized('ADMIN','VENDEDOR'),customerController.update.bind(customerController))


// Só ADMIN pode desativar — seguindo o soft delete do service
customerRoutes.patch('/:id/deactivate',isAuthenticated,isAuthorized('ADMIN'),customerController.deactivate.bind(customerController))


export default customerRoutes