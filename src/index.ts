import dotenv from "dotenv";
import express , {Express}from "express" 
import errorMiddleware from "./middlewares/error.middleware";
import notFoundMiddleware from "./middlewares/notFound.middleware";
import { requestLogger } from "./middlewares/requestLogger";
import 'express-async-errors'

dotenv.config()

const port = process.env.port || 8000

const app : Express = express();

app.use(express.json())
app.use(requestLogger)


// dont forget zodd 
//npm install zod-to-ts zod typescript
//https://www.npmjs.com/package/zod-to-ts

// glopal middleware
app.all('*', notFoundMiddleware)
//err handler
app.use(errorMiddleware)

app.listen(port , () => {
    console.log("running on port: " + port);
})
