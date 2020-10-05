const { server } = require('../src/server');

const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);

describe('404.js TESTING', () => {
  it('respond with 404 for not found routs', () => {
    return mockRequest.post('/api/foo').then(data => {
      expect(data.status).toBe(404);
      expect(data.statusMessage).toBe('Not Found');
    })
  });
});
