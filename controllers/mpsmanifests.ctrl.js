const httpCtrl = require('./http.ctrl');
const consoleLogger = require('../logger/logger.js').console;

const mpsManifestsCtrl = {};

mpsManifestsCtrl.getManifest = async (manifestUrl) => {

  // Set request values that are specific to this route
  const requestOptionsData = {
    method: 'GET',
    url: manifestUrl
  };

  return httpCtrl.makeRequest(requestOptionsData);

};

mpsManifestsCtrl.getManifestUrl = async (urn, version = '3') => {
  consoleLogger.debug('getManifestUrl');
  const mpsManifestBaseUrl = process.env.MPS_MANIFEST_BASEURL || `https://mps.lib.harvard.edu/iiif`;
  const manifestUrl = `${mpsManifestBaseUrl}/${version}/${urn}`;
  consoleLogger.debug('manifestUrl');
  consoleLogger.debug(manifestUrl);
  return manifestUrl
};

module.exports = mpsManifestsCtrl;
