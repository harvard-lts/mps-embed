const consoleLogger = require('../logger/logger.js').console;

const dimensionsCtrl = {};

dimensionsCtrl.getDimension = (dimensionParameter, defaultValue) => {
    let currentDimension = defaultValue;
    if (dimensionParameter) {
        if (Number.isInteger(parseInt(dimensionParameter))) {
            currentDimension = parseInt(Math.abs(dimensionParameter));
        }
    }
    return currentDimension;
}

module.exports = dimensionsCtrl;