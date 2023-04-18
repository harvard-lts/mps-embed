const app = require('../../app.js');
const supertest = require('supertest');
const testsAgent = supertest.agent(app);

beforeAll( async () => {
  console.log('Running embed tests.');
});

describe('Test MPS Embed Healthcheck', () => {
  test('Successful response from healthcheck route', async () => {
    const response = await testsAgent.get('/healthcheck')
      .catch(function (error) {
        console.log(error);
      });
    expect(response.status).toBe(200);
    expect(response.body.hasOwnProperty('message'));
    expect(response.body['message']).toBeDefined();
    expect(response.body['message']).not.toBeNull();
  });
});

describe('Test MPS Embed Homepage', () => {
  test('Successful response from homepage route', async () => {
    const response = await testsAgent.get('/')
      .catch(function (error) {
        console.log(error);
      });
    expect(response.status).toBe(200);
  });
});

describe('Test MPS Embed 404', () => {
  test('Successful 404 response', async () => {
    const response = await testsAgent.get('/abc/123')
      .catch(function (error) {
        console.log(error);
      });
    expect(response.status).toBe(404);
  });
});

describe('Test MPS Embed Successful API Route Legacy', () => {
  test('Successful response from api route legacy', async () => {
    const recordIdentifier = 'HUAM140429_URN-3:HUAM:INV012574P_DYNMC';
    const response = await testsAgent.get('/api/legacy?recordIdentifier='+ recordIdentifier)
      .catch(function (error) {
        console.log(error);
      });
    expect(response.status).toBe(200);
  });
});

describe('Test MPS Viewer Failed API Route Legacy', () => {
  test('Failed response from api route legacy', async () => {
    const recordIdentifier = '12345';
    const response = await testsAgent.get('/api/legacy?recordIdentifier='+ recordIdentifier)
      .catch(function (error) {
        console.log(error);
      });
    expect(response.status).toBe(200);
  });
});

describe('Test MPS Embed Successful API Route mps manifest version 2', () => {
  test('Successful response from api route mps manifest version 2', async () => {
    const urn = 'URN-3:DIV.LIB.USC:3200357';
    const response = await testsAgent.get(`/api/mps?urn=${urn}&manifestVersion=2`)
      .catch(function (error) {
        console.log(error);
      });
    expect(response.status).toBe(200);
  });
});

describe('Test MPS Embed Successful API Route mps manifest version 3', () => {
  test('Successful response from api route mps manifest version 3', async () => {
    const urn = 'URN-3:DIV.LIB.USC:3200357';
    const response = await testsAgent.get(`/api/mps?urn=${urn}&manifestVersion=3`)
      .catch(function (error) {
        console.log(error);
      });
    expect(response.status).toBe(200);
  });
});
