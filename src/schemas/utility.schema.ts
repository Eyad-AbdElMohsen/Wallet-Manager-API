import { z } from 'zod'

export const getQuerySchema = z.object({
    sort: z.string().optional(),
    limit: z.coerce.number().min(1).optional(),
    page: z.coerce.number().min(1).optional(),
}).passthrough();

export const arrayQueryField = (validFields: string[]) => {
    return z.string().refine((params) => {
        const inputParams = params.split(',')
        
        return inputParams.every((param) => {
            return validFields.includes(param)
        })
    })
}