import { NextFunction, Request, Response } from "express";

export interface CustomRequest extends Request {
    startTime?: number
}

export const requestLogger = (req: CustomRequest, res: Response, next: NextFunction) => {
    req.startTime = Date.now();
    res.on('finish', () => {
        if (req.startTime) {
            const duration = (Date.now() - req.startTime) / 1000;
            console.log(`Request to ${req.method} ${req.originalUrl} took ${duration}ms - ${res.statusCode >= 400? 'Error occurred' : 'Success'} with status code ${res.statusCode}`);
        }
    });
    next(); 
};

