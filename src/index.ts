import dotenv from "dotenv";
import express , {Express , Request , Response}from "express" 
import errorMiddleware from "./middlewares/error.middleware";
import notFoundMiddleware from "./middlewares/notFound.middleware";
import { requestLogger } from "./middlewares/requestLogger.middleware";

dotenv.config()

const port = process.env.port || 8000

const app : Express = express();

app.use(express.json())
app.use(requestLogger)


// glopal middleware
app.all('*', notFoundMiddleware)


//err handler
app.use(errorMiddleware)

app.listen(port , () => {
    console.log("running on port: " + port);
})
