const consoleLogger = require('../logger/logger.js').console;

const dimensionsCtrl = {};

dimensionsCtrl.getDimension = (dimensionParameter, defaultValue) => {
    let currentDimension = defaultValue+'px';
    if (dimensionParameter) {
        if (Number.isInteger(parseInt(dimensionParameter))) {
            currentDimension = Math.abs(parseInt(dimensionParameter));
            if (dimensionParameter.endsWith('%')) {
                currentDimension = currentDimension+'%';
            }
            else {
                currentDimension = currentDimension+'px'; 
            }
        }
    }
    return currentDimension;
}

module.exports = dimensionsCtrl;