import { walletTypeSchema } from "../utils/walletType";
import { arrayQueryField, getQuerySchema } from "./utility.schema";
import { z } from 'zod'

export const getWalletQuerySchema = getQuerySchema.extend({
    walletType: walletTypeSchema,
    fields: arrayQueryField(['_id', 'userId', 'walletName', 'currentBalance', 'type'])
}).partial();



export const createWalletData = z.object({
    walletName: z.string().min(3, 'wallet name must be at least 3 chars'),
    currentBalance: z.number().positive('current balance must be a positive number'),
    type: walletTypeSchema
})

export const updateWalletBalanceBody = z.object({ 
    newBalance: z.number().positive('current balance must be a positive number')
})

export const getWalletIdParam = z.object({
    walletId: z.string()
})