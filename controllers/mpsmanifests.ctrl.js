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

/**
 * Create manifestId (url to the manifest)
 * @param {*} urn URN of the manifest
 * @param {*} version version of the manifest 2 or 3
 * @returns manifestId fqdn url to the manifest
 */
mpsManifestsCtrl.getManifestId = async (urn, version = '3') => {
  consoleLogger.debug('getManifestId');
  const mpsManifestBaseUrl = process.env.MPS_MANIFEST_BASEURL || `https://mps.lib.harvard.edu/iiif`;
  const manifestUrl = `${mpsManifestBaseUrl}/${version}/${urn}`;
  consoleLogger.debug('manifestUrl');
  consoleLogger.debug(manifestUrl);
  return manifestUrl
};

module.exports = mpsManifestsCtrl;
