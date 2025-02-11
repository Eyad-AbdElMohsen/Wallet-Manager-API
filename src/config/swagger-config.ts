import { Options } from "swagger-jsdoc";
import { swaggerComponents } from "./swaggerComponents";

export const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Wallet-Manager API",
      version: "1.0.0",
      description: "API documentation for Wallet-Manager API",
    },
    components: swaggerComponents,
    security: [{ BearerAuth: [] }],
  },
  apis: ["src/routes/*.ts"],
};
