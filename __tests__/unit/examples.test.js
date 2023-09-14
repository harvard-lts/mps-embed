const fsPromises = require('fs').promises;
const fs = require('fs');
const examplesCtrl = require('../../controllers/examples.ctrl');

beforeAll( async () => {
  console.log('Running examples tests.');
});

describe('getExamples', () => {
    test('The example file is read properly.', () => {
        let examples = examplesCtrl.getExamples('example-items.json');
        expect(examples).not.toBeNull();
    });
});