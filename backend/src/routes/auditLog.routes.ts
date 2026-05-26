import { Router } from "express";
import { AuditLogController } from "../controllers/AuditLogController";
import { isAuthenticated } from "../middleware/auth";
import { isAuthorized } from "../middleware/role";

const auditLogRoutes = Router();
const auditLogController = new AuditLogController();

// Só ADMIN acessa logs
auditLogRoutes.get('/', isAuthenticated, isAuthorized('ADMIN'), auditLogController.listAll.bind(auditLogController));
auditLogRoutes.get('/user/:userId', isAuthenticated, isAuthorized('ADMIN'), auditLogController.listByUser.bind(auditLogController));
auditLogRoutes.get('/correlation/:correlationId', isAuthenticated, isAuthorized('ADMIN'), auditLogController.listByCorrelation.bind(auditLogController));

export default auditLogRoutes;