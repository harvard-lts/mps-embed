const httpCtrl = require('../../controllers/http.ctrl');

beforeAll( async () => {
  console.log('Running integration tests.');
});

describe('Test MPS Viewer Healthcheck', () => {
  test('Successful response from healthcheck route', async () => {

    const viewerHealthcheckRoute = 'https://mps-viewer:8081/healthcheck';

    const requestOptionsData = {
      method: 'GET',
      url: viewerHealthcheckRoute
    };

    let response;
    try {
      response = await httpCtrl.makeRequest(requestOptionsData);
    } catch (e) {
      console.log(e);
    }

    expect(response.status).toBe(200);
    expect(response.data.hasOwnProperty('message'));
    expect(response.data['message']).toBeDefined();
    expect(response.data['message']).not.toBeNull();
  });
});
