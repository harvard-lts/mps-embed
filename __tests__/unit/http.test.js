const httpCtrl = require('../../controllers/http.ctrl');
const consoleLogger = require('../../logger/logger.js').console;

describe('Item', () => {
    test('Successful response from getItem', async () => {
        let recordIdentifier = 'HUAM140429_URN-3:HUAM:INV012574P_DYNMC';
        try {
          item = await httpCtrl.getItem(recordIdentifier);
        } catch (e) {
          const errorMsg = `Unable to validate getItem: ${e}`;
          consoleLogger.error(errorMsg);
        }
    
        expect(item).not.toBeNull();
    });
    test('Unsuccessful response from getItem', async () => {
        let recordIdentifier = '12345';
        try {
          item = await httpCtrl.getItem(recordIdentifier);
        } catch (e) {
          const errorMsg = `Unable to validate getItem: ${e}`;
          consoleLogger.error(errorMsg);
        }
    
        expect(item).not.toBeNull();
    });
   
});