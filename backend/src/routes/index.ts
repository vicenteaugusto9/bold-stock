import { Router, Request, Response, RequestHandler } from "express"; // Importamos o RequestHandler para tipar a função de rota
import userRoutes from "./user.routes";
import { AuthenticateUserController } from "../controllers/AuthenticateUserController";
import { isAuthenticated } from "../middleware/auth"; // Se a sua pasta for middleware, mantenha assim

const routes = Router();
const authenticateUserController = new AuthenticateUserController();

routes.use('/users', userRoutes);
routes.post('/sessions', authenticateUserController.handle);

// O PULO DO GATO: Tipamos a função inteira como RequestHandler, aí você não precisa tipar req e res no braço!
routes.get('/me', isAuthenticated, ((req, res) => {
  return res.json({    
    message: 'Você está autenticado no Bold Stock!',
    userId: (req as any).user_id // Fazemos o cast do any direto no req aqui dentro
  });
}) as RequestHandler);

export default routes;