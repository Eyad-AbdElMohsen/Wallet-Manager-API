import { z } from 'zod'

export const transactionTypes = {
    credit: 'credit',
    debit: 'debit'
} as const;

export const categories = {
    salary: 'Salary',
    freelance: 'Freelance',
    gift: 'Gift',
    refund: 'Refund',
    food: 'Food',
    shopping: 'Shopping',
    entertainment: 'Entertainment',
    education: 'Education',
    investment: 'Investment',
    investmentReturns: 'Investment Returns',
    donations: 'Donations',
    other: 'Other',
} as const;

export const transactionTypeSchema = z.enum([
    transactionTypes.credit,
    transactionTypes.debit
]as const);


export const categorySchema = z.enum([
    categories.salary,
    categories.freelance,
    categories.gift,
    categories.refund,
    categories.food,
    categories.shopping,
    categories.entertainment,
    categories.education,
    categories.investment,
    categories.investmentReturns,
    categories.donations,
    categories.other
]as const);