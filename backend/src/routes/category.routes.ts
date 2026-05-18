import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";
import { isAuthenticated } from "../middleware/auth";
import { isAuthorized } from "../middleware/role";

const categoryRoutes = Router();
const categoryController = new CategoryController();

// todos autenticados por categoria 

categoryRoutes.get('/', isAuthenticated , categoryController.listAll.bind(categoryController));

// Apenas ADM acessa essas rotas 

categoryRoutes.post('/', isAuthenticated, isAuthorized('ADMIN'),categoryController.create.bind(categoryController));
categoryRoutes.put('/:id',isAuthenticated,isAuthorized('ADMIN'),categoryController.update.bind(categoryController));
categoryRoutes.delete('/:id',isAuthenticated,isAuthorized('ADMIN'),categoryController.delete.bind(categoryController));


export default categoryRoutes;