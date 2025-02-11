import { Options } from "swagger-jsdoc";

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
                                    status: { type: "string", example: "Error" },
                                    message: { type: "string", example: "Validation failed" },
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
                                    status: { type: "string", example: "Error" },
                                    message: { type: "string", example: "Token is invalid or expired" },
                                },
                            },
                        },
                    },
                },
                Forbidden: {
                    description: "Forbidden - You don't have permission to access this resource",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status: { type: "string", example: "Error" },
                                    message: { type: "string", example: "This user does not have access for this action" },
                                },
                            },
                        },
                    },
                },
                NotFound: {
                    description: "Resource not found",
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
                                        example: "Requested resource not found",
                                    },
                                },
                            },
                        },
                    },
                },
            },
            parameters: {
                Sort: {
                    in: "query",
                    name: "sort",
                    schema: { type: "string" },
                    description: "Sort by a specific field (e.g., createdAt or -balance)",
                },
                Limit: {
                    in: "query",
                    name: "limit",
                    schema: { type: "integer", example: 10 },
                    description: "Limit the number of results returned",
                },
                Page: {
                    in: "query",
                    name: "page",
                    schema: { type: "integer", example: 1 },
                    description: "Specify the page number for pagination",
                },
                Fields: {
                    in: "query",
                    name: "fields",
                    schema: { type: "string" },
                    description: "Select specific fields to return (e.g., name,balance)",
                },
                Filter: {
                    in: "query",
                    name: "filter",
                    schema: { type: "string" },
                    description: "Apply filters, e.g., { 'balance': { '$gte': 1000 } }",
                },
            },
        },
        security: [{ BearerAuth: [] }],
    },
    apis: ["src/routes/*.ts"],
};
