var express = require('express');
var router = express.Router();
var https = require('https');


/* GET embed from API. */
router.get('/', function(req, res, next) {
  
  function getItem(req, res) {
    return new Promise((resolve,reject)=>{
      let recordIdentifier = req.query.recordIdentifier;
      console.log('recordIdentifier:'+recordIdentifier);
      const options = {
        hostname: 'api.lib.harvard.edu',
        port: 443,
        path: '/v2/items.json?recordIdentifier='+recordIdentifier,
        method: 'GET'
      };
    
      let data = '';
      let title = '';
      let uriType = '';
      let drsFileId = '';
      let viewerServer = 'viewer-qa.lib.harvard.edu';
      
      const LibraryCloud = https.request(options, (res) => {
    
        res.on('data', (chunk) => {
            data = data + chunk.toString();
        });
      
        res.on('end', () => {
            const body = JSON.parse(data);
            if (body.items.hasOwnProperty('mods')) {
              console.log ('mods exists!');
              console.log('length: '+ body.items.mods.length);
              if (body.items.mods.length) {
                console.log('more than one!');
                Object.entries(body.items.mods).forEach(entry => {
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
                if (body.items.mods.titleInfo.length) {
                  if (body.items.mods.titleInfo[0].hasOwnProperty('title')) {
                    title = body.items.mods.titleInfo[0].title;
                  }
                }
                else {
                  if (body.items.mods.titleInfo.hasOwnProperty('title')) {
                    title = body.items.mods.titleInfo.title;
                  }
                }
                if (body.items.mods.hasOwnProperty('extension')) {
                  Object.entries(body.items.mods.extension).forEach(entry => {
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
              console.log('Title: '+title);
              console.log('Type: '+uriType);
              console.log('drsFileId: '+drsFileId);
            }

            itemData = {'title':title, 'uriType':uriType, 'drsFileId':drsFileId, 'viewerServer':viewerServer};
        });
      });
      
      LibraryCloud.on('error', (error) => {
        console.log('An error', error);
      });
      
      LibraryCloud.end();  

    resolve(itemData);
    });
  }
    
  getItem(req,res).then((itemData)=>{
    viewer_url = "https://"+itemData.viewerServer+"/viewer/"+itemData.uriType+"/"+itemData.drsFileId;
    res.json( 
      {
        type: itemData.uriType,
        version:"1.0",
        provider_name:"MPS Embed",
        title:itemData.title,
        iiif_manifest:"https://iiif.lib.harvard.edu/manifests/"+itemData.uriType+":"+itemData.drsFileId,
        viewer_url: viewer_url,
        height:400,
        width:null,
        html:"\u003ciframe src=\"/iframe?url="+viewer_url+"\" height=\"400px\" width=\"100%\" title=\"MPS Viewer\" frameborder=\"0\" marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\" allowfullscreen\u003e\u003c/iframe\u003e\n"
      }
    );
  }).catch((error)=>{
    res.json(
      {
        type: "error",
        title: "error",
        html: "There is an error with this item: " + error.toString(),
      }
    );
  });

  

});

module.exports = router;