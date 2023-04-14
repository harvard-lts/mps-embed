var express = require('express');
var router = express.Router();

const legacyManifestsCtrl = require('../controllers/legacymanifests.ctrl');

/* GET embed from API. */
router.get('/', async function(req, res, next) {
  
  let data = '';
  let viewerServer = process.env.VIEWER_SERVER;
  let recordIdentifier = req.query.recordIdentifier;

  record = await legacyManifestsCtrl.getItem(recordIdentifier);
  data = await legacyManifestsCtrl.getData(record);
  viewer_url = "https://"+viewerServer+"/viewer/"+data.uriType+"/"+data.drsFileId;
  
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