import { Options } from "swagger-jsdoc";
import env from "./env";

const isDev = env.NODE_ENV === "development";

export const swaggerOptions: Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Wallet-Manager API",
            version: "1.0.0",
            description: "API documentation for Wallet-Manager API",
        },
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            responses: {
                BadRequest: {
                    description: "Invalid request body",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status: {
                                        type: "string",
                                        example: "Error",
                                    },
                                    message: {
                                        type: "string",
                                        example: "Validation failed",
                                    },
                                },
                            },
                        },
                    },
                },
                Unauthorized: {
                    description: "Unauthorized - Missing or invalid token",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status: {
                                        type: "string",
                                        example: "Error",
                                    },
                                    message: {
                                        type: "string",
                                        example: "Token is invalid or expired",
                                    },
                                },
                            },
                        },
                    },
                },
                Forbidden: {
                    description:
                        "Forbidden - You don't have permission to access this resource",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status: {
                                        type: "string",
                                        example: "Error",
                                    },
                                    message: {
                                        type: "string",
                                        example: "This user does not have access for this action",
                                    },
                                },
                            },
                        },
                    },
                },
            },
            security: [{ BearerAuth: [] }],
        },
    },
    apis: ["src/routes/*.ts"],
};
