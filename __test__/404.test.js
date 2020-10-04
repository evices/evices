const { server } = require('../src/server');

const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);

describe('404.js TESTING', () => {
  it('respond with 404 for not found routs', () => {
    return mockRequest.get('/foo').then(data => {
        // console.log('data',data);
      expect(data.status).toBe(404);
    }).catch(err => {
      console.log(err);
    });
  });
});