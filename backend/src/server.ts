import 'dotenv/config'; // Carrega as variáveis de ambiente do arquivo .env
import express from "express"
import routes from "./routes/"

const app = express();

app.use(express.json()); //essencial para ler o corpo das requisições em JSON

app.use(routes); // Aqui estamos usando as rotas definidas no arquivo routes/index.ts, que por sua vez importa as rotas de user.routes.ts

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});