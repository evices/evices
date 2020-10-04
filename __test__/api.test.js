const { server } = require('../src/server');

const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);

describe('SERVER TESTING', ()=> {
    let trueTestObj = {
        username: 'hussain1',
        password: '12345',
      };
  it('respond with 201 if: get the route' ,() =>{
    return mockRequest.get('/user').then(data =>{
      expect(data.status).toBe(200);
    })
  });
  it('respond with 201 if: get the route with ID' , async ()  =>{
    let signupResponse = await mockRequest.post('/signup').send(trueTestObj);
    console.log('signupResponse>>>>>.',signupResponse);

    return mockRequest.get(`/user/${signupResponse.body[0]._id}`).then(data =>{
        
      expect(data.status).toBe(200);
    })
  });
  it('respond with 201 if: post user using the route' ,() =>{
    return mockRequest.post('/user/:id').then(data =>{
      expect(data.status).toBe(201);
    })
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