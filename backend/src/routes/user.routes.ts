import { Router } from 'express';
import { UserController } from '../controllers/UserControllers';
import { isAuthenticated } from '../middleware/auth';
import { isAuthorized } from '../middleware/role';

// Criamos uma instância do Router do Express
const userRoutes = Router();

// Criamos uma instância do UserController para usar seus métodos
const userController = new UserController();
// Rotas get
userRoutes.get('/id',isAuthenticated,isAuthorized('ADMIN'),userController.listAll.bind(userController))
userRoutes.get('/',isAuthenticated,userController.listAll.bind(userController))
// Definimos a rota POST /users que chama o método create do UserController
userRoutes.post('/', (req, res) => userController.create(req, res));

// Exportamos o router para ser usado em outras partes da aplicação
export default userRoutes;