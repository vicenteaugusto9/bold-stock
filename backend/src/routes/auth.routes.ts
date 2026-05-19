import { Router } from "express";
import { AuthenticateUserController } from "../controllers/AuthenticateUserController";

const authRoutes = Router();
const authenticateUserController = new AuthenticateUserController();

authRoutes.post('/', authenticateUserController.handle.bind(authenticateUserController)); 

export default authRoutes;