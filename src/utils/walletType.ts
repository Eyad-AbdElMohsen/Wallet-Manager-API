import { z } from 'zod'


export const walletType = {
    cash: "cash",
    bank: "bank",
    crypto: "crypto",
    e_wallet: "e_wallet"
} as const;



export const walletTypeSchema = z.enum([
    walletType.cash,
    walletType.bank,
    walletType.crypto,
    walletType.e_wallet
]);