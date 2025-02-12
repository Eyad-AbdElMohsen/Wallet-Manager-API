import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import 'express-async-errors';

// Middleware
import { requestLogger } from "./middlewares/requestLogger";
import errorMiddleware from "./middlewares/error.middleware";
import notFoundMiddleware from "./middlewares/notFound.middleware";

// Routers
import authRouter from "./routes/auth.route";
import walletRouter from "./routes/wallet.route";
import transactionRouter from "./routes/transaction.route";

// Swagger setup
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { swaggerOptions } from "./config/swagger-config";

export const app: Express = express();

app.use(cookieParser());
app.use(express.json());
app.use(requestLogger);
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

// Swagger documentation
const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use(authRouter);
app.use(walletRouter);
app.use(transactionRouter);

// Global middleware
app.all("*", notFoundMiddleware);

// Error handler
app.use(errorMiddleware);
