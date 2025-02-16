import { MongoMemoryReplSet } from "mongodb-memory-server";
import mongoose from 'mongoose';
import { User } from "../models/user.model";
import { Wallet } from "../models/wallet.model";
import { Transaction } from "../models/transaction.model";

let replset: MongoMemoryReplSet;

beforeAll(async () => {
    replset = await MongoMemoryReplSet.create({ replSet: { count: 4 } });
    const uri = replset.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await replset.stop();
});

afterEach(() => {
    jest.resetAllMocks()
})

afterEach(async () => {
    await Transaction.deleteMany({});
    await Wallet.deleteMany({});
    await User.deleteMany({});
});

