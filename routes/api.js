var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET embed from API. */
router.get('/', async function(req, res, next) {
  
  getItem = async (req,res) => {
    let recordIdentifier = req.query.recordIdentifier;
    let result = {};
  
    let response;
    try {
      response = await axios.get('https://api.lib.harvard.edu/v2/items.json?recordIdentifier='+recordIdentifier);
    } catch(e) {
      //const errorMsg = e.response && e.response.data || e;
      const errorMsg = e.response && e.response.data ? e.response.data : e.code;
      console.log(errorMsg);
      result.error = errorMsg;
      result.status = result.error.status || 500;
      return result;
    }
  
    result.status = response && response.status || 500;
    result.data = response && response.data || {};
    return result;
  };

  let data = '';
  let title = '';
  let uriType = '';
  let drsFileId = '';
  let viewerServer = 'viewer-qa.lib.harvard.edu';

  record = await getItem(req,res);
  if (record.data.items.hasOwnProperty('mods')) {
    if (record.data.items.mods.length) {
      Object.entries(record.data.items.mods).forEach(entry => {
        const [key, value] = entry;
        if (value.titleInfo.length) {
          if (value.titleInfo[0].hasOwnProperty('title')) {
            title = value.titleInfo[0].title;
          }
        }
        else {
          if (value.titleInfo.hasOwnProperty('title')) {
            title = value.titleInfo.title;
          }
        }
        if (value.hasOwnProperty('extension')) {
          Object.entries(value.extension).forEach(entry => {
            const [key, value] = entry;
            if (value.hasOwnProperty('DRSMetadata')) {
              uriType = value.DRSMetadata.uriType;
              uriType = uriType.toLowerCase();
              if (value.DRSMetadata.hasOwnProperty('drsFileId')) {
                drsFileId = value.DRSMetadata.drsFileId;
              }
              else {
                if (value.DRSMetadata.hasOwnProperty('drsObjectId')) {
                  uriType = 'drs';
                  drsFileId = value.DRSMetadata.drsObjectId;
                }
              }  
            }
          });
        }
      });
    }
    else {
      if (record.data.items.mods.titleInfo.length) {
        if (record.data.items.mods.titleInfo[0].hasOwnProperty('title')) {
          title = record.data.items.mods.titleInfo[0].title;
        }
      }
      else {
        if (record.data.items.mods.titleInfo.hasOwnProperty('title')) {
          title = record.data.items.mods.titleInfo.title;
        }
      }
      if (record.data.items.mods.hasOwnProperty('extension')) {
        Object.entries(record.data.items.mods.extension).forEach(entry => {
          const [key, value] = entry;
          if (value.hasOwnProperty('DRSMetadata')) {
            uriType = value.DRSMetadata.uriType;
            uriType = uriType.toLowerCase();
            if (value.DRSMetadata.hasOwnProperty('drsFileId')) {
              drsFileId = value.DRSMetadata.drsFileId;
            }
            else {
              if (value.DRSMetadata.hasOwnProperty('drsObjectId')) {
                uriType = 'drs';
                drsFileId = value.DRSMetadata.drsObjectId;
              }
            }
          }
        });
      }
        
    }
  }
  viewer_url = "https://"+viewerServer+"/viewer/"+uriType+"/"+drsFileId;
  res.json( 
    {
      type: uriType,
      version:"1.0",
      provider_name:"MPS Embed",
      title:title,
      iiif_manifest:"https://iiif.lib.harvard.edu/manifests/"+uriType+":"+drsFileId,
      viewer_url: viewer_url,
      height:400,
      width:null,
      html:"\u003ciframe src=\"/iframe?url="+viewer_url+"\" height=\"400px\" width=\"100%\" title=\"MPS Viewer\" frameborder=\"0\" marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\" allowfullscreen\u003e\u003c/iframe\u003e\n"
    }
  );

});

module.exports = router;