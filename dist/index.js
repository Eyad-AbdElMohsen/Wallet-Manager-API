"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const notFound_middleware_1 = __importDefault(require("./middlewares/notFound.middleware"));
const requestLogger_1 = require("./middlewares/requestLogger");
require("express-async-errors");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const cors_1 = __importDefault(require("cors"));
const wallet_route_1 = __importDefault(require("./routes/wallet.route"));
const transaction_route_1 = __importDefault(require("./routes/transaction.route"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use(requestLogger_1.requestLogger);
exports.app.use((0, cors_1.default)());
exports.app.use(auth_route_1.default);
exports.app.use(wallet_route_1.default);
exports.app.use(transaction_route_1.default);
// glopal middleware
exports.app.all('*', notFound_middleware_1.default);
//err handler
exports.app.use(error_middleware_1.default);
// dont forget zodd 
//npm install zod-to-ts zod typescript
//https://www.npmjs.com/package/zod-to-ts
