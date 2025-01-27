import  request  from "supertest"
import { app } from "../../src"



describe('notFoundMiddleware', () => {
    it('should throw apiError with status code 404', async() => {
        const response = await request(app).get('/api/not/found/middleware')
        expect(response.body.message).toMatch('This resourse is not available')
        expect(response.status).toBe(404)    
    })
})
