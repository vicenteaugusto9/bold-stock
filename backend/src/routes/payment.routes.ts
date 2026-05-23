import { Router } from "express";
import { PaymentController } from "../controllers/PaymentController";
import { isAuthenticated } from "../middleware/auth";
import { isAuthorized } from "../middleware/role";

const paymentRoutes = Router();
const paymentController = new PaymentController();

// Ver pagamentos — só ADMIN
paymentRoutes.get('/', isAuthenticated, isAuthorized('ADMIN'), paymentController.listAll.bind(paymentController));
paymentRoutes.get('/:id', isAuthenticated, isAuthorized('ADMIN', 'VENDEDOR'), paymentController.findById.bind(paymentController));

// Processar pagamento — ADMIN e VENDEDOR
paymentRoutes.post('/', isAuthenticated, isAuthorized('ADMIN', 'VENDEDOR'), paymentController.process.bind(paymentController));

// Estornar — só ADMIN
paymentRoutes.patch('/:id/refund', isAuthenticated, isAuthorized('ADMIN'), paymentController.refund.bind(paymentController));

export default paymentRoutes;