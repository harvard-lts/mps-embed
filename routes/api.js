const express = require('express');
const router = express.Router();
const consoleLogger = require('../logger/logger.js').console;

const legacyManifestsCtrl = require('../controllers/legacymanifests.ctrl');
const mpsManifestsCtrl = require('../controllers/mpsmanifests.ctrl');

/* GET embed from API. */
router.get('/legacy', async function(req, res, next) {

  let result = {};
  
  let viewerServer = process.env.VIEWER_SERVER;
  let recordIdentifier = req.query.recordIdentifier;

  let data;

  try {
    data = await legacyManifestsCtrl.getManifest(recordIdentifier);
  } catch(e) {
    consoleLogger.error(e);
    result.error = e;
    return res.status(500).json(result);
  }

  viewerUrl = `https://${viewerServer}/viewer/${data.uriType}/${data.drsFileId}`;

  consoleLogger.debug("api.js /legacy");
  consoleLogger.debug(viewerUrl);
  consoleLogger.debug(JSON.stringify(data));
  const manifestUrl = `https://iiif.lib.harvard.edu/manifests/${data.uriType}:${data.drsFileId}`;
  consoleLogger.debug(manifestUrl);

  res.json( 
    {
      type: data.uriType,
      version: "1.0",
      provider_name: "MPS Embed",
      title: data.title,
      iiif_manifest: manifestUrl,
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
  
  const viewerServer = process.env.VIEWER_SERVER;
  const urn = req.query.urn;
  const manifestVersion = req.query.manifestVersion || '3';

  let manifestUrl, manifestResponse, manifestData;

  try {
    manifestUrl = await mpsManifestsCtrl.getManifestUrl(urn, manifestVersion);
  } catch(e) {
    consoleLogger.error(e);
    result.error = e;
    return res.status(500).json(result);
  }

  try {
    manifestResponse = await mpsManifestsCtrl.getManifest(manifestUrl);
    manifestData = manifestResponse.data || {};
  } catch(e) {
    consoleLogger.error(e);
    result.error = e;
    return res.status(500).json(result);
  }

  viewerUrl = `https://${viewerServer}/viewer/mps/${urn}`;
  
  consoleLogger.debug("api.js /mps");
  consoleLogger.debug(viewerUrl);
  consoleLogger.debug(manifestUrl);
  //consoleLogger.debug(JSON.stringify(manifestData));

  const title = manifestData.id || '';

  res.json( 
    {
      type: "mps",
      version: "1.0",
      provider_name: "MPS Embed",
      title: title,
      iiif_manifest: manifestUrl,
      viewerUrl: viewerUrl,
      height: 400,
      width: null,
      html: "\u003ciframe src=\""+viewerUrl+"\" height=\"700px\" width=\"1200px\" title=\""+title+"\" frameborder=\"0\" marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\" allowfullscreen\u003e\u003c/iframe\u003e\n"
    }
  );

});

module.exports = router;
