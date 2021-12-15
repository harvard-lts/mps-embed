var express = require('express');
var router = express.Router();

const httpCtrl = require('../controllers/http.ctrl');

/* GET embed from API. */
router.get('/', async function(req, res, next) {
  
  let data = '';
  let viewerServer = 'viewer-qa.lib.harvard.edu';
  let recordIdentifier = req.query.recordIdentifier;

  record = await httpCtrl.getItem(recordIdentifier);
  data = await httpCtrl.getData(record);
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
      html:"\u003ciframe src=\"/iframe?url="+viewer_url+"\" height=\"400px\" width=\"100%\" title=\"MPS Viewer\" frameborder=\"0\" marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\" allowfullscreen\u003e\u003c/iframe\u003e\n"
    }
  );

});

module.exports = router;