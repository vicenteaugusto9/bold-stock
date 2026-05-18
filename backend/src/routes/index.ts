import { Router } from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";
import { isAuthenticated } from "../middleware/auth";
import { MeController } from "../controllers/meController";
import categoryRoutes from "./category.routes";
const routes = Router();
const meController = new MeController();

// Rotas públicas
routes.use('/sessions', authRoutes);

// Rotas protegidas
routes.use('/users', isAuthenticated, userRoutes);
routes.get('/me', isAuthenticated, meController.handle);
routes.use('/categories',categoryRoutes)

export default routes;