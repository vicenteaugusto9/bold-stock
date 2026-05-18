import 'dotenv/config';
import express from "express";
import routes from "./routes/";

const app = express();

app.use(express.json());

// ✅ Prefixo de versão — padrão de mercado
app.use('/api/v1', routes);

// ✅ Rota 404 — quando nenhuma rota bater
app.use((req, res) => {
    res.status(404).json({ error: "Rota não encontrada" });
});

// ✅ Middleware global de erros — captura qualquer erro não tratado
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: "Erro interno do servidor" });
});

// ✅ Porta vinda do .env
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});