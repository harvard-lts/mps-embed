const app = require('../../app.js');
const supertest = require('supertest');
const sinon = require('sinon');
const apiCtrl = require('../../controllers/api.ctrl');
const mpsManifestsCtrl = require('../../controllers/mpsmanifests.ctrl');
const consoleLogger = require('../../logger/logger.js').console;

// Unit tests are isolated tests that can be run within this container
// and must not have any dependencies on any other services
describe('API routes', () => {
  // Initialize supertest agent with app.js
  let testsAgent = supertest.agent(app);

  it('Should return healthcheck', (done) => {
    testsAgent
      .get('/healthcheck')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) {
          console.error(err);
          done(err);
        }
        expect.anything(res);
        expect(res.status).toBe(200)
        done();
      });
  });

  it('Should return error when legacy recordidentifier is empty', (done) => {
    testsAgent
      .get('/api/legacy?recordIdentifier=')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(500)
      .end((err, res) => {
        if (err) {
          console.error(err);
          done(err);
        }
        expect.anything(res);
        expect(res.status).toBe(500)
        done();
      });
  });

  it('Should return 500 error when getManifestId in mps route fails', (done) => {
    let stub = sinon.stub(mpsManifestsCtrl, 'getManifestId').throws(Error('api call failed'));
    testsAgent
      .get('/api/mps?urn=URN-3:HUL.GUEST:409464&manifestVersion=3')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(500)
      .end((err, res) => {
        if (err) {
          console.error(err);
          done(err);
        }
        expect.anything(res);
        expect(res.status).toBe(500);
        stub.restore();
        done();
      });
  });

  it('Should return 500 error when getManifest in mps route fails', (done) => {
    let stub = sinon.stub(mpsManifestsCtrl, 'getManifest').throws(Error('api call failed'));
    testsAgent
      .get('/api/mps?urn=URN-3:HUL.GUEST:409464&manifestVersion=3')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(500)
      .end((err, res) => {
        if (err) {
          console.error(err);
          done(err);
        }
        expect.anything(res);
        expect(res.status).toBe(500);
        stub.restore();
        done();
      });
  });   

  it('Should return 500 error when getManifest in manifest route fails', (done) => {
    let stub = sinon.stub(mpsManifestsCtrl, 'getManifest').throws(Error('api call failed'));
    testsAgent
      .get('/api/manifest?manifestId=https://iiif.lib.harvard.edu/manifests/drs:8282494&manifestVersion=3')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(500)
      .end((err, res) => {
        if (err) {
          console.error(err);
          done(err);
        }
        expect.anything(res);
        expect(res.status).toBe(500);
        stub.restore();
        done();
      });
  });

  it('Should return 500 error when getManifest in nrs route fails', (done) => {
    let stub = sinon.stub(mpsManifestsCtrl, 'getManifest').throws(Error('api call failed'));
    testsAgent
      .get('/api/nrs?urn=URN-3:HUL.GUEST:409464')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(500)
      .end((err, res) => {
        if (err) {
          console.error(err);
          done(err);
        }
        expect.anything(res);
        expect(res.status).toBe(500);
        stub.restore();
        done();
      });
  });  

  it('Should return empty when manifest manifestId is empty', (done) => {
    testsAgent
      .get('/api/manifest?manifestId=')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) {
          console.error(err);
          done(err);
        }
        expect.anything(res);
        expect(res.status).toBe(200)
        done();
      });
  });

  test('mps route getTitle with label', async () => {
    const manifestData = {label: 'Ross, Ronald Sir 1857-1932. Mosquito brigades and how to organize them.'};
    let title = '';
    try {
      title = await apiCtrl.getTitle(manifestData);
    } catch (e) {
      const errorMsg = `Unable to validate getTitle: ${e}`;
      consoleLogger.error(errorMsg);
    }

    expect(title).not.toBeNull();
  });

  test('mps route getTitle with label none', async () => {    
    const manifestData = {label: {none: ['Ross, Ronald Sir 1857-1932. Mosquito brigades and how to organize them.']}};
    let title = '';
    try {
      title = await apiCtrl.getTitle(manifestData);
    } catch (e) {
      const errorMsg = `Unable to validate getTitle: ${e}`;
      consoleLogger.error(errorMsg);
    }

    expect(title).not.toBeNull();
  });

});
