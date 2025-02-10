import { categorySchema, transactionTypeSchema } from "../utils/transactionType";
import { arrayQueryField, getQuerySchema } from "./utility.schema";


export const getTransactionsQuerySchema = getQuerySchema.extend({
    transactionType: transactionTypeSchema,
    category: categorySchema,
    fields: arrayQueryField(["_id", "walletId", "userId", "type", "category", "amount"])
}).partial();