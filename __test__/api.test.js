const base64 = require ('base-64')
const { server } = require('../src/server');
const userTest = require('../src/model/user/user-collection');
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);

describe('SERVER TESTING', ()=> {
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

    
  it('respond with 201 if: get the route' ,() =>{
    return mockRequest.get('/user').then(data =>{
      expect(data.status).toBe(200);
    })
  });
  it('respond with 201 if: get the route with ID' , async ()  =>{
    let obj = {
      username: 'hussein5',
      password: '214',
    };
    let signupResponse = await mockRequest.post('/signup').send(obj);
    console.log('signupResponse>>>>>.',signupResponse.body);

    return mockRequest.get(`/user/${signupResponse.body.result._id}`).then(data =>{
        
      expect(data.status).toBe(200);
    })
  });

  it('respond with 201 if: post user using the route' , async () =>{
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