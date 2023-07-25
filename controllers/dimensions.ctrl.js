const consoleLogger = require('../logger/logger.js').console;

const dimensionsCtrl = {};

dimensionsCtrl.getDimension = (dimensionParameter, defaultValue) => {
    let currentDimension = defaultValue;
    if (dimensionParameter) {
        if (Number.isInteger(parseInt(dimensionParameter))) {
            currentDimension = parseInt(dimensionParameter);
            currentDimension = Math.abs(currentDimension);
        }
    }
    return currentDimension;
}

module.exports = dimensionsCtrl;