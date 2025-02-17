import { MongoMemoryReplSet } from "mongodb-memory-server";
import mongoose from 'mongoose';
import { User } from "../models/user.model";
import { Wallet } from "../models/wallet.model";
import { Transaction } from "../models/transaction.model";

const dbName = "dbName"
const replicaSetName = 'replicaSetName'
let replSet: MongoMemoryReplSet

beforeAll(async () => {
    replSet = await MongoMemoryReplSet.create({
        replSet: {
            dbName,
            name: replicaSetName,
        },
    });
    
    await replSet.waitUntilRunning();
    const uri = replSet.getUri()
    await mongoose.connect(uri)
});

afterAll(async () => {
    await mongoose.disconnect();
    await replSet.stop()
});

afterEach(async () => {
    jest.resetAllMocks()
    await Transaction.deleteMany({});
    await Wallet.deleteMany({});
    await User.deleteMany({});
})


