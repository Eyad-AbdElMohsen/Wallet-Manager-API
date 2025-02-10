import { walletTypeSchema } from "../utils/walletType";
import { arrayQueryField, getQuerySchema } from "./utility.schema";

export const getWalletQuerySchema = getQuerySchema.extend({
    walletType: walletTypeSchema,
    fields: arrayQueryField(['_id', 'userId', 'walletName', 'currentBalance', 'type'])
}).partial();