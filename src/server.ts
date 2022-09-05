//Libs
import express, { json } from 'express';
import cors from "cors";
import 'dotenv/config';

//Main Route
import router from './routes/index.js';

//Error Handler
import { errorHandler } from './middlewares/errorHandler.middleware.js';

//Configs
const server = express();

server.use(cors());
server.use(json());

server.use(router);

server.use(errorHandler)

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Servidor tá rodando mais que a bola quadrada do Quico, na porta ${PORT}.`);
});