import { Request, Response, NextFunction } from "express";
import ApiError from "../errors/api.error";


const errorMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => { // next here is a must
    let message = "Internal server error", code = 500, path, data
    if(err instanceof ApiError){
        message = err.message
        code = err.code
        path = err.path
        data = err.data
    }
    res.status(code).json({
        status: 'Error',
        message: message,
        path: path,
        data: data
    })
}


export default errorMiddleware