'use strict';
const {
    server
} = require('../src/server');
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);
const base64 = require('base-64');

describe('check extra routes to get categories from post schema', () => {
    let newUser, sign
    beforeAll(async () => {

        newUser = {
            username: "Nedal",
            password: "1234",
            role: "admin"
        }

        let newPost = {
            username: "Nedal",
            title: "create your wall",
            description: "call me whenever you want",
            category: "TECH"
        }
        let newPost2 = {
            username: "Nedal",
            title: "fix your home",
            description: "call me at 9:00",
            category: "CARPENTER"
        }
        let authHeader = await base64.encode(`${newUser.username}:${newUser.password}`);
        await mockRequest.post('/signup').send(newUser)
        sign = await mockRequest.post('/signin').set('authorization', `Basic ${authHeader}`)
        await mockRequest.post('/post').set('authorization', `Bearer ${sign.body.token}`).send(newPost)
        await mockRequest.post('/post').set('authorization', `Bearer ${sign.body.token}`).send(newPost2)
    })
    it('can get all category from the database unique', async () => {
        let getCategory = await mockRequest.get('/category')
        expect(getCategory.status).toBe(200)
        expect(getCategory.body.length).toBe(2)
    })
    it('can get a specific category',async()=>{
        let getCategory = await mockRequest.get('/category/TECH')
        expect(getCategory.status).toBe(200)
    })
})