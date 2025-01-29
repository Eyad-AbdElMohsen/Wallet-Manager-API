import ApiError from "../../errors/api.error";




describe('errorMiddleware', () => {
    it('should return new api error', async() => {
        await expect(Promise.reject(new ApiError('new api error', 500))).rejects.toThrow('new api error');
    })

    it('should return new error', async() => {
        await expect(Promise.reject(new Error('new error'))).rejects.toThrow('new error');

    })

    it('should return new unknown error', async() => {
        await expect(Promise.reject('new unknown error')).rejects.toBe('new unknown error');
    })
})

