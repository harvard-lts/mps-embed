const consoleLogger = require('../logger/logger.js').console;
const fsPromises = require('fs').promises;
const path = require('path');

const examplesCtrl = {};

/**
 * getExamples
 * Get the examples from the example file. 
 * @method
 */
examplesCtrl.getExamples = async (jsonFile = 'example-items.json') => {
    await fsPromises.readFile(path.join(__dirname, '..', 'config', jsonFile))
    .then(function (result) {
        data = result;
    })
    .catch(function (error) {
        console.log(error);
        throw new TypeError('The example file is not read properly.');
    })

    return JSON.parse(data.toString());
};

module.exports = examplesCtrl;