import { z } from 'zod' 
import { createWalletData, getWalletQuerySchema } from '../../schemas/wallet.schema';
import { walletType } from '../../utils/walletType';
import { createWallet, deleteMyWallet, getAllMyCurrentBalance, getMyWallets, updateWalletBalance } from '../../services/wallet.service';
import { v4 as uuidv4 } from "uuid";
import { IWallet, Wallet } from '../../models/wallet.model';
import ApiError from '../../errors/api.error';


describe('createWallet', () => {
    let data: z.infer<typeof createWalletData> & { userId: string }

    beforeEach(() => {
        data = {
            walletName: 'test',
            currentBalance: 505,
            type: walletType.cash,
            userId: uuidv4()
        }
    })

    it('should return new wallet data', async () => {
        const res = await createWallet(data)

        expect(res).toEqual(expect.objectContaining({
            _id: res._id,
            walletName: res.walletName,
            currentBalance: res.currentBalance,
            type: res.type,
            userId: res.userId
        }))
    })
});


describe('getMyWallets', () => {
    let queryObject: z.infer<typeof getWalletQuerySchema>
    let userId: string

    beforeEach(async () => {
        queryObject = {
            type: walletType.bank,
            fields: '_id,currentBalance',
            sort: "currentBalance",
            limit: 10,
            page: 1
        }
        userId = uuidv4()
    })

    it('should throw an error with message "No wallets found!" 404', async () => {
        await expect(getMyWallets(userId, queryObject)).rejects.toThrow('No wallets found!')
    })

    it('should return all user wallets', async () => {
        const wallet_1 = await Wallet.create({
            walletName: 'smaller',
            currentBalance: 200,
            type: walletType.bank,
            userId
        })

        const wallet_2 = await Wallet.create({
            walletName: 'unspecified wallet',
            currentBalance: -20,
            type: walletType.cash,
            userId
        })

        const wallet_3 = await Wallet.create({
            walletName: 'bigger',
            currentBalance: 500,
            type: walletType.bank,
            userId
        })

        const res = await getMyWallets(userId, queryObject)

        // wallet 2 is not specified our filteration
        expect(res).not.toEqual(expect.arrayContaining([
            expect.objectContaining({
                _id: wallet_2._id,
            }),
        ]));

        // wallet 1, 3 are specified our filteration
        expect(res).toEqual(expect.arrayContaining([
            expect.objectContaining({
                _id: wallet_1._id,
                currentBalance: wallet_1.currentBalance,
            }),
            expect.objectContaining({
                _id: wallet_3._id,
                currentBalance: wallet_3.currentBalance,
            }),
        ]));

        // make sure about sort operation
        expect(res).toEqual([
            expect.objectContaining({ currentBalance: 200 }),
            expect.objectContaining({ currentBalance: 500 }),
        ]);
    })

    it('should throw an error if fields contain invalid values', async () => {
        const query = { fields: 'currentBalance,unknownField' };
        await expect(getMyWallets(userId, query))
            .rejects.toThrow(ApiError);
    });
})

describe('updateWalletBalance', () => {
    let wallet: IWallet, newBalance: number
    beforeEach(()=> {
        wallet = {} as IWallet
    })

    it('should return wallet data after udpating the balance', async() => {
        newBalance = 200
        wallet = await Wallet.create({
            walletName: 'test',
            currentBalance: 500,
            type: walletType.bank,
            userId: uuidv4()
        })

        const res = await updateWalletBalance(wallet, newBalance)


        expect(res).toEqual(expect.objectContaining({
            currentBalance: newBalance
        }));
    })
})

describe('getAllMyCurrentBalance', () => {
    let userId = uuidv4()

    it('should return all user balance', async () => {
        await Wallet.create(
            {
                walletName: 'test1',
                currentBalance: 200,
                type: walletType.bank,
                userId
            },
            {
                walletName: 'test2',
                currentBalance: 500,
                type: walletType.bank,
                userId
            }
        )
    
        await Wallet.create()
    
        const res = await getAllMyCurrentBalance(userId)
    
        expect(res).toEqual(500 + 200);
    })
})


describe('getAllMyCurrentBalance', () => {
    it('should delete user wallet', async () => {
        const wallet = await Wallet.create({
            walletName: 'test1',
            currentBalance: 200,
            type: walletType.bank,
            userId: uuidv4()
        })

        expect(await Wallet.findById(wallet._id)).toBeTruthy()

        await deleteMyWallet(wallet)

        expect(await Wallet.findById(wallet._id)).toBeNull()
    })
})
