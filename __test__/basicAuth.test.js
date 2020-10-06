require('dotenv').config();
const {
  server
} = require('../src/server.js');
const supergoose = require('@code-fellows/supergoose');
const agent = supergoose(server);
const base64 = require('base-64');
const jwt = require('jsonwebtoken');
const oauth = require('../src/middleware/oauth');

const user = require('../src/model/user/user-collection');

describe('basic-auth middlleware', () => {
  let trueTestObj = {
    username: 'hussain1',
    password: '12345',
  };

  //   let falseObj = {
  //     username: 'hussain1',
  //     password: '12345',
  //   };

  it('allow a new user to signup', async () => {
    let signupResponse = await agent.post('/signup').send(trueTestObj);
    expect(signupResponse.status).toBe(201);
    expect(!!signupResponse.text).toBeTruthy();
  });

  it('oAuth', async () => {
    let req = {
      req: {
        code: "4/P7q7W91a-oMsCeLvIaQm6bTrgtp7&"
      }
    };
    let signupResponse = await agent.get('/oauth').send(req);
    expect(signupResponse.status).toBe(500);
  });

  //   it('invalid signup', async() => {
  //     jest.spyOn(global.console, 'error');
  //     console.log = jest.fn();
  //     let signupResponse = await agent.post('/signup').send(falseObj);
  //     expect(console.log).toHaveBeenCalled();
  //     expect(signupResponse.status).toBe(403);
  //   });

  it('can allow an existing user to sign in', async () => {
    let authHeader = base64.encode(
      `${trueTestObj.username}:${trueTestObj.password}`,
    );

    let signinResponse = await agent
      .post('/signin')
      .set('authorization', `Basic ${authHeader}`);

    expect(signinResponse.status).toBe(200);
    expect(!!signinResponse.text).toBeTruthy();
  });


  it('will return a 500 error for incorrect login credentials', async () => {

    let realBadAuthHeader = base64.encode(
      `testingbobred:wrong-password1234`,
    );

    let signinResponse = await agent
      .post('/signin')
      .set('authorization', `Basic ${realBadAuthHeader}`);

    expect(signinResponse.statusCode).toBe(500);
    expect(signinResponse.body.general_msg).toEqual("Something went wrong O_O");

    let wrongPasswordHeader = base64.encode(
      `${trueTestObj.username}:wrong-password1234-again-555`,
    );

    let signinResponse2 = await agent
      .post('/signin')
      .set('authorization', `Basic ${wrongPasswordHeader}`);
    expect(signinResponse2.statusCode).toBe(500);
    expect(signinResponse2.body.general_msg).toEqual("Something went wrong O_O");
  });

  it('Expired token', async () => {
    console.log("Token: kkkkkk");
    let newPost = {
      username: "Nedal",
      title: "create your wall",
      description: "call me whenever you want",
      category: "TECH"
    }
    let posting = await agent.post('/post').set('authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNzY1ODM1ZTllZWZiMzdlYzg3ZDViNCIsInVzZXJuYW1lIjoid2FsZWVkYWZpZmk4Iiwicm9sZSI6ImFkbWluIiwiY2FwYWJpbGl0aWVzIjpbInJlYWQiLCJjcmVhdGUiLCJ1cGRhdGUiLCJkZWxldGUiXSwiZXhwaXJlc0luIjo5MDAwMDAsImlhdCI6MTYwMTkwMzg4N30.3Y4TaHaJdAek8cTqbL3dxYwdhADPTPgX4vVSwuFi0iA`).send(newPost)

    expect(posting.status).toBe(500);
  });

  it('Has user', async () => {
    newUser = {
      username: "Nedal1",
      password: "1234",
      role: "seller",
      capcity: 1
    }

    let authHeader = await base64.encode(`${newUser.username}:${newUser.password}`);
    await agent.post('/signup').send(newUser)
    let sign = await agent.post('/signin').set('authorization', `Basic ${authHeader}`);
    let sign1 = await agent.post('/signin').set('authorization', ``);

    let deletge = await agent.delete('/post/4eedno4i3info34f').set('authorization', `Basic ${authHeader}`);
    console.log(sign.deletge);

    let uauth = await user.authenticateToken(sign.body.token);
    // console.log(uauth);
    expect(uauth.username).toBe(newUser.username);

  });


  it('Has no user', async () => {
    var newUser = {
      username: "Nedal1",
      password: "1234",
      role: "seller",
      capcity: 1
    };

    var signed = await jwt.sign({
      role: newUser.role,
      expiresIn: 900000,
    }, process.env.SECRET);


    var uauth = user.authenticateToken(signed);
      console.log(uauth);
  });

});