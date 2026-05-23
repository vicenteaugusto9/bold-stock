import { Router } from "express";
import { SaleController } from "../controllers/SaleController";
import { isAuthenticated } from "../middleware/auth";
import { isAuthorized } from "../middleware/role";

const saleRoutes = Router();
const saleController = new SaleController();

// Ver vendas
saleRoutes.get('/', isAuthenticated, isAuthorized('ADMIN', 'VENDEDOR'), saleController.listAll.bind(saleController));
saleRoutes.get('/:id', isAuthenticated, isAuthorized('ADMIN', 'VENDEDOR'), saleController.findById.bind(saleController));

// Criar venda — ADMIN e VENDEDOR
saleRoutes.post('/', isAuthenticated, isAuthorized('ADMIN', 'VENDEDOR'), saleController.create.bind(saleController));

// Confirmar pagamento
saleRoutes.patch('/:id/payment', isAuthenticated, isAuthorized('ADMIN', 'VENDEDOR'), saleController.confirmPayment.bind(saleController));

// Cancelar — só ADMIN
saleRoutes.patch('/:id/cancel', isAuthenticated, isAuthorized('ADMIN'), saleController.cancel.bind(saleController));

export default saleRoutes;