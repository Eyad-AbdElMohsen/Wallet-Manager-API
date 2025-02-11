import { Options } from 'swagger-jsdoc';
import env from './env';

const isDev = env.NODE_ENV === 'development';

export const swaggerOptions: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Wallet-Manager API',
            version: '1.0.0',
            description: 'API documentation for Wallet-Manager API',
        },
    },
    apis: ['src/routes/*.ts'],
};
