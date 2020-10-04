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









// ==============================
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
    username: "Nedal",
    title: "create your wall",
    description: "call me whenever you want",
    category: "TECH"
  }
  it('the user can not post without signup as a seller', () => {
    return mockRequest.post('/post').send(newPost).then(posting => {
      expect(posting.status).toBe(500)
    }).catch(err => {
      console.log(err);
    })
  })

  // it('the user can post if he signed as a seller', async () => {

  //   let authHeader = await base64.encode(`${newUser.username}:${newUser.password}`);
  //   await mockRequest.post('/signup').send(newUser)
  //   let sign = await mockRequest.post('/signin').set('authorization', `Basic ${authHeader}`)
  //   let posting = await mockRequest.post('/post').set('authorization', `Basic ${authHeader}`).send(newPost)
  //   let record = posting.body;

  //   expect(sign.statusCode).toBe(200)
  //   expect(posting.status).toBe(201)
  //   expect(record.username).toEqual(newPost.username)
  //   expect(record.title).toEqual(newPost.title)
  //   expect(record.description).toEqual(newPost.description)
  // })

  it('can load all posts from database, GET',async()=>{
    let allPosts=await mockRequest.get('/post')
    expect(allPosts.status).toBe(200)
  })

  it('can load specific posts from database, GET',async()=>{
    let authHeader = await base64.encode(`${newUser.username}:${newUser.password}`);
    let sign = await mockRequest.post('/signin').set('authorization', `Basic ${authHeader}`)
    let posting = await mockRequest.post('/post').set('authorization', `Basic ${authHeader}`).send(newPost)
    let record = posting.body._id;
    let allPosts=await mockRequest.get(`/post/${record}`)
    expect(allPosts.status).toBe(200)
  })

  it('user can update all data in the post or specific property',async ()=>{
    let updatePost = {
      username: "Nedal",
      title: "fix your fire wall",
      description: "call me after at 9:00 am",
      category: "TECH"
    }
    let authHeader = await base64.encode(`${newUser.username}:${newUser.password}`);
    let sign = await mockRequest.post('/signin').set('authorization', `Basic ${authHeader}`)
    let posting = await mockRequest.post('/post').set('authorization', `Basic ${authHeader}`).send(newPost)
    let record = posting.body._id;
    let update=await mockRequest.put(`/post/${record}`).set('authorization',`Bearer ${sign.body.token}`).send(updatePost)
    expect(update.status).toEqual(201)
    expect(update.body.title).toEqual(updatePost.title)
    expect(update.body.description).toEqual(updatePost.description)

    let patch=await mockRequest.put(`/post/${record}`).set('authorization',`Bearer ${sign.body.token}`).send({username: "Jaber"})
    expect(patch.status).toEqual(201)
    expect(patch.body.username).toEqual('Jaber')

  })
  
})
// ======================