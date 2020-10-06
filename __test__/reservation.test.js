'use strict';
const {
    server
} = require('../src/server')
const supergoose = require('@code-fellows/supergoose')
const mockRequest = supergoose(server)
const base64 = require('base-64');
const reservCol = require('../src/model/reservation/reservation-collection')
describe('the user can make reservtion', () => {
    let newUser, newUser2, sign, sign2, posting
    beforeAll(async () => {

        newUser = {
            username: "Nedal",
            password: "1234",
            role: "seller",
            capcity: 1
        }
        newUser2 = {
            username: "Hussin",
            password: "1234",
            role: "user",
        }

        let newPost = {
            username: "Nedal",
            title: "create your wall",
            description: "call me whenever you want",
            category: "TECH"
        }

        let authHeader = await base64.encode(`${newUser.username}:${newUser.password}`);
        let authHeader2 = await base64.encode(`${newUser2.username}:${newUser2.password}`);
        await mockRequest.post('/signup').send(newUser)
        await mockRequest.post('/signup').send(newUser2)
        sign = await mockRequest.post('/signin').set('authorization', `Basic ${authHeader}`)
        sign2 = await mockRequest.post('/signin').set('authorization', `Basic ${authHeader2}`)
        posting = await mockRequest.post('/post').set('authorization', `Bearer ${sign.body.token}`).send(newPost)
    })
    it('create new reservation', async () => {
        console.log("sign<<>>><><><><>", posting.body);
        let newReservation = {
            user_id: sign2.body.user._id,
            provider_id: sign.body.user._id,
            post_id: posting.body._id,
            book_date: new Date()
        }
        let createNew = await reservCol.create(newReservation);
        Object.keys(newReservation).forEach(key => {
            expect(createNew[key]).toEqual(newReservation[key])
        })
    })

    it('the seller can approve the reservation sent from any user ', async () => {
        let getReservation = await mockRequest.get('/reservation')
        let record = getReservation.body.result[0]._id;
        let approveReservation = await mockRequest.patch(`/reservation/${record}`).set('authorization', `Bearer ${sign.body.token}`).send({
            is_approved: 1
        })
        let getUser = await mockRequest.get(`/user/${sign.body.user._id}`)
        expect(approveReservation.status).toBe(201)
        expect(approveReservation.body.is_approved).toEqual(1)
        // expect(getUser.body.result[0].capcity).toEqual(0)

    })

    it('the seller can approve the reservation sent from any user ', async () => {
        let newUser5 = {
            username: "Hussign",
            password: "1234",
            role: "user",
            capcity: -1
        }
        let authHeader1 = await base64.encode(`${newUser5.username}:${newUser5.password}`);
        await mockRequest.post('/signup').send(newUser5)
        let sign5 = await mockRequest.post('/signin').set('authorization', `Basic ${authHeader1}`)


        let newReservation = {
            user_id: sign5.body.user._id,
            provider_id: sign5.body.user._id,
            post_id: posting.body._id,
            book_date: new Date()
        }
        let createNew = await reservCol.create(newReservation);

    })
})