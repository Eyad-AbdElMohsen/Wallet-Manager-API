"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const notFound_middleware_1 = __importDefault(require("./middlewares/notFound.middleware"));
const requestLogger_1 = require("./middlewares/requestLogger");
require("express-async-errors");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const port = process.env.port || 8000;
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use(requestLogger_1.requestLogger);
exports.app.use(auth_route_1.default);
// glopal middleware
exports.app.all('*', notFound_middleware_1.default);
//err handler
exports.app.use(error_middleware_1.default);
exports.app.listen(port, () => {
    console.log("running on port: " + port);
});
// dont forget zodd 
//npm install zod-to-ts zod typescript
//https://www.npmjs.com/package/zod-to-ts
