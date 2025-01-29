import express , {Express}from "express" 
import errorMiddleware from "./middlewares/error.middleware";
import notFoundMiddleware from "./middlewares/notFound.middleware";
import { requestLogger } from "./middlewares/requestLogger";
import 'express-async-errors'
import authRouter from "./routes/auth.route";


export const app : Express = express();



app.use(express.json())
app.use(requestLogger)


app.use(authRouter)


// glopal middleware
app.all('*', notFoundMiddleware)

//err handler
app.use(errorMiddleware)



// dont forget zodd 
//npm install zod-to-ts zod typescript
//https://www.npmjs.com/package/zod-to-ts