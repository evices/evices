const {server} = require('../src/server');

const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);

describe('500.js TESTING', () => {
  it('should respond with 500 for bad routes', async ()=>{
    const data = await mockRequest.get('/bad-request');
    // console.log('data:', data);
    expect(data.statusCode).toBe(500);
  });
});