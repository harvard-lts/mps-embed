const legacyManifestsCtrl = require('../../controllers/legacymanifests.ctrl');
const consoleLogger = require('../../logger/logger.js').console;

beforeAll( async () => {
  console.log('Running manifest tests.');
});

describe('Manifests', () => {

  test('Successful response from legacy manifests getItem', async () => {
    const recordIdentifier = 'HUAM140429_URN-3:HUAM:INV012574P_DYNMC';
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

});
