import 'dotenv/config';
// refact e melhorias Importamos o express-async-errors logo no topo para capturar erros assíncronos automaticamente.
// Lembre-se de rodar no terminal: npm i express-async-errors
import 'express-async-errors'; 

import express from "express";
import routes from "./routes/";
// refact e melhorias Importamos a classe AppError para usá-la na checagem do middleware.
import { AppError } from './shared/errors';
const app = express();

app.use(express.json());

//  Prefixo de versão — padrão de mercado
app.use('/api/v1', routes);

//  Rota 404 — quando nenhuma rota bater
app.use((req, res) => {
    res.status(404).json({ error: "Rota não encontrada" });
});

//  Middleware global de erros — atualizado para capturar o AppError
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    
    // refact e melhorias Se o erro for uma instância do AppError, devolvemos o status e a mensagem que definimos no Service.
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    // Se for qualquer outro erro inesperado (banco fora do ar, erro de sintaxe, etc.) cai aqui:
    console.error(err.stack);
    return res.status(500).json({ error: "Erro interno do servidor" });
});

// ✅ Porta vinda do .env
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});