const app = require('../../app.js');
const legacyManifestsCtrl = require('../../controllers/legacymanifests.ctrl');
const mpsManifestsCtrl = require('../../controllers/mpsmanifests.ctrl');
const consoleLogger = require('../../logger/logger.js').console;
const supertest = require('supertest');
const sinon = require('sinon');

beforeAll( async () => {
  console.log('Running manifest tests.');
});

describe('Manifests', () => {
  // Initialize supertest agent with app.js
  let testsAgent = supertest.agent(app);

 test('Successful response from legacy manifests getItem for single image', async () => {
    const recordIdentifier = 'W401849_URN-3:HUL.ARCH:2009749';
    try {
      item = await legacyManifestsCtrl.getItem(recordIdentifier);
    } catch (e) {
      const errorMsg = `Unable to validate getItem: ${e}`;
      consoleLogger.error(errorMsg);
    }

    expect(item).not.toBeNull();
  });

  test('Successful response from legacy manifests getItem for PTO', async () => {
    const recordIdentifier = '990100671200203941';
    try {
      item = await legacyManifestsCtrl.getItem(recordIdentifier);
    } catch (e) {
      const errorMsg = `Unable to validate getItem: ${e}`;
      consoleLogger.error(errorMsg);
    }

    expect(item).not.toBeNull();
  });

  test('Unsuccessful response from legacy manifests getItem', async () => {
    const recordIdentifier = '12345';
    try {
      item = await legacyManifestsCtrl.getItem(recordIdentifier);
    } catch (e) {
      const errorMsg = `Unable to validate getItem: ${e}`;
      consoleLogger.error(errorMsg);
    }

    expect(item).not.toBeNull();
  });

  test('error response from legacy manifests getItem', async () => {
    const recordIdentifier = '';
    try {
      item = await legacyManifestsCtrl.getItem(recordIdentifier);
    } catch (e) {
      const errorMsg = `Unable to validate getItem: ${e}`;
      consoleLogger.error(errorMsg);
    }

    expect(item).not.toBeNull();
  });

  test('Successful response from legacy manifests getManifest', async () => {
    const recordIdentifier = 'W401849_URN-3:HUL.ARCH:2009749';
    try {
      item = await legacyManifestsCtrl.getManifest(recordIdentifier);
    } catch (e) {
      const errorMsg = `Unable to validate getItem: ${e}`;
      consoleLogger.error(errorMsg);
    }

    expect(item).not.toBeNull();
  });

  test('Unsuccessful response from legacy manifests getManifest', async () => {
    const recordIdentifier = '';
    expect.assertions(1);
    try {
      item = await legacyManifestsCtrl.getManifest(recordIdentifier);
    } catch (e) {
      const errorMsg = `Unable to validate getItem: ${e}`;
      consoleLogger.error(errorMsg);
    }

    expect(item).not.toBeNull();
  });

  test('Successful response from mps manifests getManifest', async () => {
    const manifestId = 'https://mps.lib.harvard.edu/iiif/3/URN-3:DIV.LIB:29999858';
    try {
      item = await mpsManifestsCtrl.getManifest(manifestId);
    } catch (e) {
      const errorMsg = `Unable to validate getItem: ${e}`;
      consoleLogger.error(errorMsg);
    }

    expect(item).not.toBeNull();
  });

  test('Unsuccessful response from mps manifests getManifest', async () => {
    const manifestId = 'https://mps.lib.harvard.edu/iiif/3/';
    try {
      item = await mpsManifestsCtrl.getManifest(manifestId);
    } catch (e) {
      const errorMsg = `Unable to validate getItem: ${e}`;
      consoleLogger.error(errorMsg);
    }

    expect(item).toContain('HTTP request error url');
  });  

  test('Successful response from mps manifests getManifestId default manifest', async () => {
    const urn = 'URN-3:DIV.LIB:29999858';
    const version = '';
    const productionOverride = '';
    try {
      item = await mpsManifestsCtrl.getManifestId(urn, version, productionOverride);
    } catch (e) {
      const errorMsg = `Unable to validate getItem: ${e}`;
      consoleLogger.error(errorMsg);
    }

    expect(item).not.toBeNull();
  }); 

  test('Successful response from mps manifests getManifestId production v3 manifest', async () => {
    const urn = 'URN-3:DIV.LIB:29999858';
    const version = '3';
    const productionOverride = '1';
    try {
      item = await mpsManifestsCtrl.getManifestId(urn, version, productionOverride);
    } catch (e) {
      const errorMsg = `Unable to validate getItem: ${e}`;
      consoleLogger.error(errorMsg);
    }

    expect(item).not.toBeNull();
  });

  test('Successful response from mps manifests getManifestId v3 manifest', async () => {
    const urn = 'URN-3:DIV.LIB:29999858';
    const version = '3';
    const productionOverride = '';
    try {
      item = await mpsManifestsCtrl.getManifestId(urn, version, productionOverride);
    } catch (e) {
      const errorMsg = `Unable to validate getItem: ${e}`;
      consoleLogger.error(errorMsg);
    }

    expect(item).not.toBeNull();
  });

  test('Successful response from mps manifests production getManifestId v2 manifest', async () => {
    const urn = 'URN-3:DIV.LIB:29999858';
    const version = '2';
    const productionOverride = '1';
    try {
      item = await mpsManifestsCtrl.getManifestId(urn, version, productionOverride);
    } catch (e) {
      const errorMsg = `Unable to validate getItem: ${e}`;
      consoleLogger.error(errorMsg);
    }

    expect(item).not.toBeNull();
  });  

  test('Successful response from mps manifests getManifestId v2 manifest', async () => {
    const urn = 'URN-3:DIV.LIB:29999858';
    const version = '2';
    const productionOverride = '';
    try {
      item = await mpsManifestsCtrl.getManifestId(urn, version, productionOverride);
    } catch (e) {
      const errorMsg = `Unable to validate getItem: ${e}`;
      consoleLogger.error(errorMsg);
    }

    expect(item).not.toBeNull();
  });

  test('setDRSId with drsFileId', async () => {
    const extension = [{DRSMetadata: {drsFileId: '10274486', uriType: 'IDS',}}];
    let data = {};
    try {
      data = await legacyManifestsCtrl.setDRSId(extension, data);
    } catch (e) {
      const errorMsg = `Unable to validate getItem: ${e}`;
      consoleLogger.error(errorMsg);
    }

    expect(data.uriType).toBe('ids');
  });

  test('setDRSId with drsObjectId', async () => {
    const extension = [{DRSMetadata: {drsObjectId: '4997399', uriType: 'PDS',}}];
    let data = {};
    try {
      data = await legacyManifestsCtrl.setDRSId(extension, data);
    } catch (e) {
      const errorMsg = `Unable to validate setDRSId: ${e}`;
      consoleLogger.error(errorMsg);
    }

    expect(data.uriType).toBe('drs');
  });

  test('setTitle with array', async () => {
    const titleInfo = [{ title: 'Hot dog in the manger' }];
    let data = {};
    try {
      data = await legacyManifestsCtrl.setTitle(titleInfo, data);
    } catch (e) {
      const errorMsg = `Unable to validate setTitle: ${e}`;
      consoleLogger.error(errorMsg);
    }

    expect(data.title).toBe('Hot dog in the manger');
  });

  test('setTitle with string', async () => {
    const titleInfo = { title: 'To roast a chicken; show #217' };
    let data = {};
    try {
      data = await legacyManifestsCtrl.setTitle(titleInfo, data);
    } catch (e) {
      const errorMsg = `Unable to validate setTitle: ${e}`;
      consoleLogger.error(errorMsg);
    }

    expect(data.title).toBe('To roast a chicken; show #217');
  });

  test('Response from empty getData', async () => {
    const record = '';
    let data;
    try {
      data = await legacyManifestsCtrl.getData(record);
    } catch (e) {
      const errorMsg = `Unable to validate getData: ${e}`;
      consoleLogger.error(errorMsg);
    }

    expect(data).toBeUndefined();
  });

  it('Should return 500 error when getData in legacy route fails', (done) => {
    let stub = sinon.stub(legacyManifestsCtrl, 'getData').throws(Error('api call failed'));
    testsAgent
      .get('/api/legacy?recordIdentifier=W401849_URN-3:HUL.ARCH:2009749')
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

});


