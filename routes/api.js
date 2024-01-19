const express = require('express');
const router = express.Router();
const consoleLogger = require('../logger/logger.js').console;

const apiCtrl = require('../controllers/api.ctrl');
const legacyManifestsCtrl = require('../controllers/legacymanifests.ctrl');
const mpsManifestsCtrl = require('../controllers/mpsmanifests.ctrl');
const dimensionsCtrl = require('../controllers/dimensions.ctrl');

const viewerServer = process.env.VIEWER_SERVER;

/* GET embed from API. */
router.get('/legacy', async function(req, res, next) {
  
  let recordIdentifier = req.query.recordIdentifier;
  let currentWidth='100%';
  let currentHeight='100%';
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

  const legacyManifestBaseUrl = process.env.LEGACY_MANIFEST_BASEURL || `https://iiif.lib.harvard.edu/manifests`;

  const manifestId = `${legacyManifestBaseUrl}/${data.uriType}:${data.drsFileId}`;
  
  consoleLogger.debug(`manifestId`);
  consoleLogger.debug(manifestId);

  viewerUrl.searchParams.append("manifestId", manifestId);

  consoleLogger.debug(`viewerUrl`);
  consoleLogger.debug(viewerUrl);

  consoleLogger.debug('width: '+req.query.width);
  consoleLogger.debug('height: '+req.query.height);
  currentWidth = dimensionsCtrl.getDimension('100%', currentWidth);
  currentHeight = dimensionsCtrl.getDimension('100%', currentHeight);
  
  res.json( 
    {
      type: data.uriType,
      version: "1.0",
      provider_name: "MPS Embed",
      title: data.title,
      iiif_manifest: manifestId,
      viewerUrl: viewerUrl,
      html: "\u003ciframe name='mps-embed-legacy' src='"+viewerUrl+"' height='"+currentHeight+"' width='"+currentWidth+"' title='"+data.title+"' frameborder='0' marginwidth='0' marginheight='0' scrolling='no' allowfullscreen\u003e\u003c/iframe\u003e"
    }
  );

});

router.get('/mps', async function(req, res, next) {

  let result = {};
  
  const urn = req.query.urn;
  const manifestVersion = req.query.manifestVersion;
  const viewerUrl = new URL(`https://${viewerServer}/viewer/`);
  const productionOverride = req.query.prod;
  
  consoleLogger.debug("api.js /mps");
  consoleLogger.debug(`urn ${urn} manifestVersion ${manifestVersion}`);

  let manifestId, manifestResponse, manifestData;
  let currentWidth='100%';
  let currentHeight='100%';

  try {
    manifestId = await mpsManifestsCtrl.getManifestId(urn, manifestVersion, productionOverride);
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
  //consoleLogger.debug(JSON.stringify(manifestData));
  viewerUrl.searchParams.append("manifestId", manifestId);
  consoleLogger.debug(viewerUrl);

  let title = apiCtrl.getTitle(manifestData);

  consoleLogger.debug('width: '+req.query.width);
  consoleLogger.debug('height: '+req.query.height);
  currentWidth = dimensionsCtrl.getDimension('100%', currentWidth);
  currentHeight = dimensionsCtrl.getDimension('100%', currentHeight);
  
  res.json( 
    {
      type: "mps",
      version: "1.0",
      provider_name: "MPS Embed",
      title: title,
      iiif_manifest: manifestId,
      viewerUrl: viewerUrl,
      html: "\u003ciframe name='mps-embed-mps' src='"+viewerUrl+"' height='"+currentHeight+"' width='"+currentWidth+"' title='"+title+"' frameborder='0' marginwidth='0' marginheight='0' scrolling='no' allowfullscreen\u003e\u003c/iframe\u003e"
    }
  );

});

router.get('/manifest', async function(req, res, next) {

  let result = {};
  
  const manifestId = req.query.manifestId;
  const viewerUrl = new URL(`https://${viewerServer}/viewer/`);
  
  consoleLogger.debug("api.js /manifest");
  consoleLogger.debug(`manifestId ${manifestId}`);

  let manifestResponse, manifestData;
  let currentWidth='100%';
  let currentHeight='100%';

  try {
    manifestResponse = await mpsManifestsCtrl.getManifest(manifestId);
    manifestData = manifestResponse.data || {};
  } catch(e) {
    consoleLogger.error(e);
    result.error = e;
    return res.status(500).json(result);
  }

  //consoleLogger.debug(JSON.stringify(manifestData));
  viewerUrl.searchParams.append("manifestId", manifestId);
  consoleLogger.debug(viewerUrl);

  let title = apiCtrl.getTitle(manifestData);

  consoleLogger.debug('width: '+req.query.width);
  consoleLogger.debug('height: '+req.query.height);
  currentWidth = dimensionsCtrl.getDimension('100%', currentWidth);
  currentHeight = dimensionsCtrl.getDimension('100%', currentHeight); 
  
  res.json( 
    {
      type: "manifest",
      version: "1.0",
      provider_name: "MPS Embed",
      title: title,
      iiif_manifest: manifestId,
      viewerUrl: viewerUrl,
      html: "\u003ciframe name='mps-embed-manifest' src='"+viewerUrl+"' height='"+currentHeight+"' width='"+currentWidth+"' title='"+title+"' frameborder='0' marginwidth='0' marginheight='0' scrolling='no' allowfullscreen\u003e\u003c/iframe\u003e"
    }
  );

});

router.get('/nrs', async function(req, res, next) {

  let result = {};

  const urn = req.query.urn;
  const productionOverride = req.query.prod;
  const sequence = req.query.n;
  const nrsBaseUrl  = (productionOverride == 1) ? process.env.NRS_PRODURL : process.env.NRS_BASEURL || `https://nrs.harvard.edu`;
  consoleLogger.debug("api.js /manifest");
  consoleLogger.debug(`urn ${urn}`);

  let sequenceViewString = '';
  if (sequence) {
    if (Number.isInteger(parseFloat(sequence))) {
      sequenceViewString = '?n='+sequence;
    }
  }
  let currentWidth='100%';
  let currentHeight='100%'; 
  let manifestId = nrsBaseUrl+'/'+urn+':MANIFEST';
  let viewerUrl = nrsBaseUrl+'/'+urn+':VIEW'+sequenceViewString;
  let manifestResponse, manifestData;

  try {
    manifestResponse = await mpsManifestsCtrl.getManifest(manifestId);
    manifestData = manifestResponse.data || {};
  } catch(e) {
    consoleLogger.error(e);
    result.error = e;
    return res.status(500).json(result);
  } 
  //consoleLogger.debug(JSON.stringify(manifestData));
  let title = apiCtrl.getTitle(manifestData);

  res.json( 
    {
      type: "manifest",
      version: "1.0",
      provider_name: "MPS Embed",
      title: title,
      iiif_manifest: manifestId,
      viewerUrl: viewerUrl,
      html: "\u003ciframe name='mps-embed-nrs' src='"+viewerUrl+"' height='"+currentHeight+"' width='"+currentWidth+"' title='"+title+"' frameborder='0' marginwidth='0' marginheight='0' scrolling='no' allowfullscreen\u003e\u003c/iframe\u003e"
    }
  );

});

module.exports = router;
