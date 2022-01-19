const axios = require('axios');
const https = require('https');
const app = require('../../app.js');
const supertest = require('supertest');

axios.defaults.adapter = require('axios/lib/adapters/http');
axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false });

beforeAll( async () => {
    console.log('Running healthcheck tests.');
});

/**
 * Smoke tests
 * @group smoke
 */
describe('Test MPS Embed Healthcheck', () => {
    test('Successful response from healthcheck route', async () => {
        let testsAgent = supertest.agent(app);
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
        let testsAgent = supertest.agent(app);
        const response = await testsAgent.get('/')
            .catch(function (error) {
                console.log(error);
            });
        expect(response.status).toBe(200);
    });
});

describe('Test MPS Embed 404', () => {
    test('Successful 404 response', async () => {
        let testsAgent = supertest.agent(app);
        const response = await testsAgent.get('/abc/123')
            .catch(function (error) {
                console.log(error);
            });
        expect(response.status).toBe(404);
    });
});

describe('Test MPS Embed Successful API Route', () => {
    test('Successful response from api route', async () => {
        let testsAgent = supertest.agent(app);
        let recordIdentifier = 'HUAM140429_URN-3:HUAM:INV012574P_DYNMC';
        const response = await testsAgent.get('/api?recordIdentifier='+ recordIdentifier)
            .catch(function (error) {
                console.log(error);
            });
        expect(response.status).toBe(200);
    });
});

describe('Test MPS Viewer Failed API Route', () => {
    test('Failed response from api route', async () => {
        let testsAgent = supertest.agent(app);
        let recordIdentifier = '12345';
        const response = await testsAgent.get('/api?recordIdentifier='+ recordIdentifier)
            .catch(function (error) {
                console.log(error);
            });
        expect(response.status).toBe(200);
    });
});