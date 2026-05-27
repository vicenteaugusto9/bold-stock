import 'dotenv/config';
import express from "express";
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';
import routes from "./routes/";

const app = express();

app.use(express.json());

// ✅ Swagger
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Bold Stock API Docs',
    customCss: '.swagger-ui .topbar { background-color: #0D1B2A }'
}));

app.use('/api/v1', routes);

app.use((req, res) => {
    res.status(404).json({ error: "Rota não encontrada" });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: "Erro interno do servidor" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Docs: http://localhost:${PORT}/api/v1/docs`);
});