const express = require('express');
const router = express.Router();
const consoleLogger = require('../logger/logger.js').console;

const legacyManifestsCtrl = require('../controllers/legacymanifests.ctrl');
const mpsManifestsCtrl = require('../controllers/mpsmanifests.ctrl');

const viewerServer = process.env.VIEWER_SERVER;

/* GET embed from API. */
router.get('/legacy', async function(req, res, next) {
  
  let recordIdentifier = req.query.recordIdentifier;
  const viewerUrl = new URL(`https://${viewerServer}/viewer/`);

  let data, result = {};

  try {
    data = await legacyManifestsCtrl.getManifest(recordIdentifier);
  } catch(e) {
    consoleLogger.error(e);
    result.error = e;
    return res.status(500).json(result);
  }
  
  consoleLogger.debug("api.js /legacy");
  consoleLogger.debug(JSON.stringify(data));
  const manifestId = `https://iiif.lib.harvard.edu/manifests/${data.uriType}:${data.drsFileId}`;
  
  consoleLogger.debug(`manifestId`);
  consoleLogger.debug(manifestId);

  consoleLogger.debug(`viewerUrl before`);
  consoleLogger.debug(viewerUrl);
  viewerUrl.searchParams.append("manifestId", manifestId);
  consoleLogger.debug(`viewerUrl after`);
  consoleLogger.debug(viewerUrl);

  res.json( 
    {
      type: data.uriType,
      version: "1.0",
      provider_name: "MPS Embed",
      title: data.title,
      iiif_manifest: manifestId,
      viewerUrl: viewerUrl,
      height: 400,
      width: null,
      html: "\u003ciframe src=\""+viewerUrl+"\" height=\"700px\" width=\"1200px\" title=\""+data.title+"\" frameborder=\"0\" marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\" allowfullscreen\u003e\u003c/iframe\u003e\n"
    }
  );

});

router.get('/mps', async function(req, res, next) {
  consoleLogger.debug("api.js /mps");

  let result = {};
  
  const urn = req.query.urn;
  const manifestVersion = req.query.manifestVersion || '3';
  const viewerUrl = new URL(`https://${viewerServer}/viewer/`);
  
  let manifestId, manifestResponse, manifestData;

  try {
    manifestId = await mpsManifestsCtrl.getManifestId(urn, manifestVersion);
  } catch(e) {
    consoleLogger.error(e);
    result.error = e;
    return res.status(500).json(result);
  }

  try {
    manifestResponse = await mpsManifestsCtrl.getManifest(manifestId);
    manifestData = manifestResponse.data || {};
  } catch(e) {
    consoleLogger.error(e);
    result.error = e;
    return res.status(500).json(result);
  }

  viewerUrl.searchParams.append("manifestId", manifestId);
  
  consoleLogger.debug("api.js /mps");
  consoleLogger.debug(viewerUrl);
  consoleLogger.debug(manifestId);
  //consoleLogger.debug(JSON.stringify(manifestData));

  const title = manifestData.id || '';

  res.json( 
    {
      type: "mps",
      version: "1.0",
      provider_name: "MPS Embed",
      title: title,
      iiif_manifest: manifestId,
      viewerUrl: viewerUrl,
      height: 400,
      width: null,
      html: "\u003ciframe src=\""+viewerUrl+"\" height=\"700px\" width=\"1200px\" title=\""+title+"\" frameborder=\"0\" marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\" allowfullscreen\u003e\u003c/iframe\u003e\n"
    }
  );

});

module.exports = router;
