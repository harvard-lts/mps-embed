const dimensionsCtrl = require('../../controllers/dimensions.ctrl');

beforeAll( async () => {
  console.log('Running dimensions tests.');
});

describe('getDimension', () => {
    test('If the dimensionParameter is empty, defaultValue is returned.', () => {
        const dimensionParameter = '';
        const defaultValue = 100;
        let dimension = dimensionsCtrl.getDimension(dimensionParameter, defaultValue);
        expect(dimension).toBe('100px');
    });
    test('If the dimensionParameter is not a number, defaultValue is returned.', () => {
        const dimensionParameter = 'abc';
        const defaultValue = 100;
        let dimension = dimensionsCtrl.getDimension(dimensionParameter, defaultValue);
        expect(dimension).toBe('100px');
    });
    test('If the dimensionParameter is a number, the absolute value is returned with px.', () => {
        const dimensionParameter = '700';
        const defaultValue = 100;
        let dimension = dimensionsCtrl.getDimension(dimensionParameter, defaultValue);
        expect(dimension).toBe('700px');
    });
    test('If the dimensionParameter is a percent, the absolute value is returned with %.', () => {
        const dimensionParameter = '50%';
        const defaultValue = 100;
        let dimension = dimensionsCtrl.getDimension(dimensionParameter, defaultValue);
        expect(dimension).toBe('50%');
    });    

});