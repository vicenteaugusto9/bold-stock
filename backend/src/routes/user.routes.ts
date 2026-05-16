import { Router } from 'express';
import { UserController } from '../controllers/UserControllers';

// Criamos uma instância do Router do Express
const userRoutes = Router();

// Criamos uma instância do UserController para usar seus métodos
const userController = new UserController();

// Definimos a rota POST /users que chama o método create do UserController
userRoutes.post('/', (req, res) => userController.create(req, res));

// Exportamos o router para ser usado em outras partes da aplicação
export default userRoutes;