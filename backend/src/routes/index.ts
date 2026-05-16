import { Router } from "express";
import userRoutes from "./user.routes";

const routes = Router();

// Adicionamos as rotas de usuário ao router principal
routes.use('/users', userRoutes);


//no furo, podemos adicionar mais rotas aqui, como rotas para produtos, vendas, etc.

export default routes;