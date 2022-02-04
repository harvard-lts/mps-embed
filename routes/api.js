var express = require('express');
var router = express.Router();

const httpCtrl = require('../controllers/http.ctrl');

/* GET embed from API. */
router.get('/', async function(req, res, next) {
  
  let data = '';
  let record = '';
  let viewerUrl = '';
  let iiifManifest = '';
  let removePager = '';
  let viewerServer = process.env.VIEWER_SERVER;
  let recordIdentifier = req.query.recordIdentifier;

  record = await httpCtrl.getItem(recordIdentifier);
  data = await httpCtrl.getData(record);
  iiifManifest = "https://iiif.lib.harvard.edu/manifests/"+data.uriType+":"+data.drsFileId;
  removePager = await httpCtrl.removePager(iiifManifest);
  viewerUrl = "https://"+viewerServer+"/viewer/"+data.uriType+"/"+data.drsFileId+"?"+removePager;

  res.json( 
    {
      type: data.uriType,
      version:"1.0",
      provider_name:"MPS Embed",
      title:data.title,
      iiif_manifest:iiifManifest,
      viewer_url: viewerUrl,
      height:400,
      width:null,
      html:"\u003ciframe src=\""+viewerUrl+"\" height=\"700px\" width=\"1200px\" title=\""+data.title+"\" frameborder=\"0\" marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\" allowfullscreen\u003e\u003c/iframe\u003e\n"
    }
  );

});

module.exports = router;