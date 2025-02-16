import { User } from "../../models/user.model";
import { getUserByGoogleId } from "../../services/user.service";
import { v4 as uuidv4 } from "uuid";


describe('getUserByGoogleId', () => {
    it ('should return null if there is not a user', async() => {
        const id = uuidv4()
        const res = await getUserByGoogleId(id)
        expect(res).toBeNull(); 
    })


    it ('should return user data if found', async() => {
        const userMock = await User.create({
            name: 'test name',
            email: 'test@test.com',
            picture: 'picId',
            googleId: uuidv4()
        })
        const res = await getUserByGoogleId(userMock.googleId)
        expect(res).toEqual(expect.objectContaining({
            name: userMock.name,
            email: userMock.email,
            picture: userMock.picture,
            googleId: userMock.googleId
        }));
    })
});