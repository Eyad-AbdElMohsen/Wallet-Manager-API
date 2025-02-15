import { app } from "../../index";
import ApiError from "../../errors/api.error";
import request from 'supertest'


jest.mock('../../middlewares/requestLogger.ts', () => {
    return {
        requestLogger: jest.fn((req, res, next) => {
            // Instead of logging the request, we force it to throw an error
            next(new ApiError('new api error', 500))
        })
    }
})

describe('errorMiddleware', () => {
    it('should return new api error', async() => {
        const response = await request(app).get('/test/api-error').expect(500)
        expect(response.body.message).toMatch('new api error')
    })
})

