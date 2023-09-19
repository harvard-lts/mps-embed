const consoleLogger = require('../logger/logger.js').console;

const apiCtrl = {};

apiCtrl.getTitle = (manifestData) => {
    let title = manifestData.id || ''; 
    if (manifestData.hasOwnProperty('label')) {
        if (manifestData.label.hasOwnProperty('none')) {
            title = manifestData.label.none[0] || '';
        } 
        else {
            title = manifestData.label || '';
        }
    }
    return title;
}

module.exports = apiCtrl;