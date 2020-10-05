'use strict';
const {
  server
} = require('../src/server');
const userTest = require('../src/model/user/user-collection');
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);
const base64 = require('base-64');

describe('SERVER TESTING', () => {
  let trueTestObj = {
    username: 'hussain1',
    password: '12345',
  };
  it('it can create() new user', async () => {
    let userTestObj = {
      username: 'userHussain',
      password: '12345',
      role: 'user',
    };
    const result = await userTest.create(userTestObj);
    Object.keys(userTestObj).forEach(key => {
      expect(result[key]).toEqual(userTestObj[key]);
    });
  });
  it('it can create() new seller', async () => {
    let adminTestObj = {
      username: 'adminHussain',
      password: '12345',
      role: 'admin',
    };
    const result = await userTest.create(adminTestObj);
    Object.keys(adminTestObj).forEach(key => {
      expect(result[key]).toEqual(adminTestObj[key]);
    });
  });

  it('it can create() new seller', async () => {
    let sellerTestObj = {
      username: 'sellerHussain',
      password: '12345',
      role: 'seller',
    };
    const result = await userTest.create(sellerTestObj);
    Object.keys(sellerTestObj).forEach(key => {
      expect(result[key]).toEqual(sellerTestObj[key]);
    });
  });


  it('respond with 201 if: get the route', () => {
    return mockRequest.get('/user').then(data => {
      expect(data.status).toBe(200);
    })
  });
  it('respond with 201 if: get the route with ID', async () => {
    let obj = {
      username: 'hussein5',
      password: '214',
    };
    let signupResponse = await mockRequest.post('/signup').send(obj);
    console.log('signupResponse>>>>>.', signupResponse.body);

    expect(signupResponse.status).toBe(201);
  })

  it('respond with 201 if: post user using the route', async () => {
    let obj = {
      username: 'waleed',
      password: 'waleed',
      role: 'admin',
      fullname: 'Waleed Afifi'
    }
    let signupResponse = await mockRequest.post('/signup').send(obj);
    expect(signupResponse.status).toBe(201);

  });
  it('will return a 500 error for incorrect login credentials', async () => {

    let realBadAuthHeader = base64.encode(
      `testingbobred:wrong-password1234`,
    );

    let signinResponse = await mockRequest
      .post('/signin')
      .set('authorization', `Basic ${realBadAuthHeader}`);

    expect(signinResponse.statusCode).toBe(500);
    expect(signinResponse.body).toEqual({});

    let wrongPasswordHeader = base64.encode(
      `${trueTestObj.username}:wrong-password1234-again-555`,
    );

    let signinResponse2 = await mockRequest
      .post('/signin')
      .set('authorization', `Basic ${wrongPasswordHeader}`);
    expect(signinResponse2.statusCode).toBe(500);
    expect(signinResponse2.body).toEqual({});
  });

});






// ==============================
describe('Posting Services on the app', () => {
  let newUser, sign
  beforeAll(async () => {

    newUser = {
      username: "Nedal",
      password: "1234",
      role: "admin"
    }
    let authHeader = await base64.encode(`${newUser.username}:${newUser.password}`);
    await mockRequest.post('/signup').send(newUser)
    sign = await mockRequest.post('/signin').set('authorization', `Basic ${authHeader}`)
  })
  // let newUser2 = {
  //   username: "hussain",
  //   password: "1234",
  //   role: "user"
  // }

  let newPost = {
    username: "Nedal",
    title: "create your wall",
    description: "call me whenever you want",
    category: "TECH"
  }
  it('the user can not post without signup as a seller',async () => {
    let posting = await mockRequest.post('/post').send(newPost)
    expect(posting.status).toBe(500)

  })

  it('the user can post if he signed as a seller', async () => {


    let posting = await mockRequest.post('/post').set('authorization', `Bearer ${sign.body.token}`).send(newPost)
    let record = posting.body;

    expect(sign.statusCode).toBe(200)
    expect(posting.status).toBe(201)
    expect(record.username).toEqual(newPost.username)
    expect(record.title).toEqual(newPost.title)
    expect(record.description).toEqual(newPost.description)
  })

  it('can load all posts from database, GET', async () => {
    let allPosts = await mockRequest.get('/post')
    expect(allPosts.status).toBe(200)
  })

  it('can load specific posts from database, GET', async () => {
    let posting = await mockRequest.post('/post').set('authorization', `Bearer ${sign.body.token}`).send(newPost)
    let record = posting.body._id;
    let allPosts = await mockRequest.get(`/post/${record}`)
    expect(allPosts.status).toBe(200)
  })

  it('user can update all data in the post or specific property', async () => {
    let updatePost = {
      username: "Nedal",
      title: "fix your fire wall",
      description: "call me after at 9:00 am",
      category: "TECH"
    }
    let posting = await mockRequest.post('/post').set('authorization', `Bearer ${sign.body.token}`).send(newPost)
    let record = posting.body._id;
    let update = await mockRequest.put(`/post/${record}`).set('authorization', `Bearer ${sign.body.token}`).send(updatePost)
    expect(update.status).toEqual(201)
    expect(update.body.title).toEqual(updatePost.title)
    expect(update.body.description).toEqual(updatePost.description)

    let patch = await mockRequest.patch(`/post/${record}`).set('authorization', `Bearer ${sign.body.token}`).send({
      username: "Jaber"
    })
    expect(patch.status).toEqual(201)
    expect(patch.body.username).toEqual('Jaber')

  })
  it('user can delete the post if he has the permission as a seller',async()=>{
    let posting = await mockRequest.post('/post').set('authorization', `Bearer ${sign.body.token}`).send(newPost)
    let record = posting.body._id;
    console.log('>>>>>>>>>>>>>>>',record);
    let deleteMethod = await mockRequest.delete(`/post/${record}`).set('authorization', `Bearer ${sign.body.token}`)
    expect(deleteMethod.status).toEqual(200)

  })

})
// ======================