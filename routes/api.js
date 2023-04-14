const express = require('express');
const router = express.Router();
const consoleLogger = require('../logger/logger.js').console;

const legacyManifestsCtrl = require('../controllers/legacymanifests.ctrl');

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

  viewer_url = "https://"+viewerServer+"/viewer/"+data.uriType+"/"+data.drsFileId;
  
  consoleLogger.info("api.js /legacy");
  consoleLogger.info(viewer_url);
  consoleLogger.info(JSON.stringify(data));

  res.json( 
    {
      type: data.uriType,
      version:"1.0",
      provider_name:"MPS Embed",
      title:data.title,
      iiif_manifest:"https://iiif.lib.harvard.edu/manifests/"+data.uriType+":"+data.drsFileId,
      viewer_url: viewer_url,
      height:400,
      width:null,
      html:"\u003ciframe src=\""+viewer_url+"\" height=\"700px\" width=\"1200px\" title=\""+data.title+"\" frameborder=\"0\" marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\" allowfullscreen\u003e\u003c/iframe\u003e\n"
    }
  );

});

router.get('/mps', async function(req, res, next) {
  
  let data = '';
  let viewerServer = process.env.VIEWER_SERVER;
  let recordIdentifier = req.query.recordIdentifier;

  record = await legacyManifestsCtrl.getItem(recordIdentifier);
  data = await legacyManifestsCtrl.getData(record);

  
  res.json( 
    {
      type: data.uriType,
      version:"1.0",
      provider_name:"MPS Embed",
      title:data.title,
      iiif_manifest:"https://iiif.lib.harvard.edu/manifests/"+data.uriType+":"+data.drsFileId,
      viewer_url: viewer_url,
      height:400,
      width:null,
      html:"\u003ciframe src=\""+viewer_url+"\" height=\"700px\" width=\"1200px\" title=\""+data.title+"\" frameborder=\"0\" marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\" allowfullscreen\u003e\u003c/iframe\u003e\n"
    }
  );

});

module.exports = router;
