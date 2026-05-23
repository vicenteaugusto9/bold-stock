import { Router } from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";
import { isAuthenticated } from "../middleware/auth";
import { MeController } from "../controllers/meController";
import categoryRoutes from "./category.routes";
import productRoutes from "./product.routes";
import customerRoutes from "./customer.routes";
import stockRoutes from "./stock.routes";
import saleRoutes from "./sale.routes";
import paymentRoutes from "./payment.routes";




const routes = Router();
const meController = new MeController();

// Rotas públicas
routes.use('/sessions', authRoutes);

// Rotas protegidas
routes.use('/users', isAuthenticated, userRoutes);
routes.get('/me', isAuthenticated, meController.handle);
routes.use('/categories',categoryRoutes)
routes.use('/products',productRoutes)
routes.use('/customers',customerRoutes)
routes.use('/stock', stockRoutes);
routes.use('/sales', saleRoutes);
routes.use('/payments', paymentRoutes);

export default routes;