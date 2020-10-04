const {
  server
} = require('../src/server');

const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);
const base64 = require('base-64');

describe('SERVER TESTING', () => {
  let trueTestObj = {
    username: 'hussain1',
    password: '12345',
  };
  it('respond with 201 if: get the route', () => {
    return mockRequest.get('/user').then(data => {
      expect(data.status).toBe(200);
    })
  });
  it('respond with 201 if: get the route with ID', async () => {
    let signupResponse = await mockRequest.post('/signup').send(trueTestObj);
    console.log('signupResponse>>>>>.', signupResponse.body);

    return mockRequest.get(`/user/${signupResponse.body.result._id}`).then(data => {

      expect(data.status).toBe(200);
    })
  });

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

  //   it('respond with 201 if: put user into the route' ,() =>{
  //     return mockRequest.put('/user/:id').then(data =>{
  //       expect(data.status).toBe(201);
  //     }).catch(err =>{
  //       console.log(err);
  //     });
  //   });
  //   it('respond with 201 if: delete products using the route' ,() =>{
  //     return mockRequest.delete('api/v1/products/:id').then(data =>{
  //       expect(data.status).toBe(201);
  //     }).catch(err =>{
  //       console.log(err);
  //     });
  //   });
});

describe('Posting Services on the app', () => {
  let newUser = {
    username: "Nedal",
    password: "1234",
    role: "seller"
  }
  let newUser2 = {
    username: "hussain",
    password: "1234",
    role: "user"
  }
  let newPost = {
    "username": "Nedal",
    "password": "1234",
    "title": "create your wall",
    "description": "call me whenever you want",
    "category": "TECH"
  }
  it('the user can not post without signup as a seller', () => {
    return mockRequest.post('/post').send(newPost).then(posting=>{
      expect(posting.status).toBe(500)
    }).catch(err=>{
      console.log(err);
    })
  })

  it('the user can post if he signed in as a seller',()=>{

    mockRequest.post('/signup').send(newUser)
    mockRequest.post('/signin').set('authorization', `Basic ${authHeader}`)
  })
})
