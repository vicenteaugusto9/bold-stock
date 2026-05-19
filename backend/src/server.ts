import 'dotenv/config';
import express from "express";
import routes from "./routes/";
import { AppError } from './shared/errors'; 

const app = express();

app.use(express.json());

// ✅ Prefixo de versão — padrão de mercado
app.use('/api/v1', routes);

// ✅ Rota 404 — quando nenhuma rota bater
app.use((req, res) => {
    res.status(404).json({ error: "Rota não encontrada" });
});

// ✅ Middleware global de erros — O Express v5 vai jogar os erros assíncronos direto aqui!
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    console.error(err.stack);
    return res.status(500).json({ error: "Erro interno do servidor" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});