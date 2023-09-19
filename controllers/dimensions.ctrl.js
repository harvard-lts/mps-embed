const consoleLogger = require('../logger/logger.js').console;

const dimensionsCtrl = {};

/**
 * getDimension
 * Get the dimension from the parameter. 
 * If the dimensionParameter is not a number, the default value is returned.
 * If the dimensionParameter is a number, the absolute value is returned.
 * If the dimensionParameter is a number, a unit is added.
 * If the dimensionParameter ends with '%', the '%' is added, otherwise 'px' is added.
 * @method
 * @param {string} dimensionParameter - The dimension parameter.
 * @param {number} defaultValue - The default value.
 */
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