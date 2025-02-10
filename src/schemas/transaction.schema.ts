import { categorySchema, transactionTypeSchema } from "../utils/transactionType";
import { arrayQueryField, getQuerySchema } from "./utility.schema";
import { z } from 'zod' 

export const getTransactionsQuerySchema = getQuerySchema.extend({
    type: transactionTypeSchema,
    category: categorySchema,
    fields: arrayQueryField(["_id", "walletId", "userId", "type", "category", "amount"])
}).partial();


export const createTransactionBody = z.object({
    type: transactionTypeSchema,
    category: categorySchema,
    amount: z.number().positive(
        'Amount must be positive. Use type "debit" for deductions.'
    )
})

export const createTransactionAllData = createTransactionBody.extend({
    walletId: z.string(),
    userId: z.string(),
})

export const getTransactionIdParam = z.object({
    transactionId: z.string()
})
