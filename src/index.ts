import express , {Express}from "express" 
import errorMiddleware from "./middlewares/error.middleware";
import notFoundMiddleware from "./middlewares/notFound.middleware";
import { requestLogger } from "./middlewares/requestLogger";
import 'express-async-errors'
import authRouter from "./routes/auth.route";
import cookieParser from "cookie-parser";
import cors from 'cors'
import walletRouter from "./routes/wallet.route";
import transactionRouter from "./routes/transaction.route";
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { swaggerOptions } from './config/swagger-config';

export const app : Express = express();


app.use(cookieParser());
app.use(express.json())
app.use(requestLogger)
app.use(
    cors({
        origin: "https://walletsmanager.netlify.app",
        credentials: true,
    })
);

// Swagger setup
const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(authRouter)
app.use(walletRouter)
app.use(transactionRouter)

// glopal middleware
app.all('*', notFoundMiddleware)

//err handler
app.use(errorMiddleware)
