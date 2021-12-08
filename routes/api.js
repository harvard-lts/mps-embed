var express = require('express');
var router = express.Router();
var https = require('https');


/* GET embed from API. */
router.get('/', function(req, res, next) {
  
  function getItem(req, res) {
    return new Promise((resolve,reject)=>{
      let urn = req.query.urn;
      console.log('urn:'+urn);
      const options = {
        hostname: 'api.lib.harvard.edu',
        port: 443,
        path: '/v2/items.json?urn='+urn,
        method: 'GET'
      };
    
      let data = '';
      let title = '';
      let uriType = '';
      let drsFileId = '';
      
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
                  if (value.titleInfo.hasOwnProperty('title')) {
                    title = value.titleInfo.title;
                  }
                  if (value.hasOwnProperty('extension')) {
                    Object.entries(value.extension).forEach(entry => {
                      const [key, value] = entry;
                      if (value.hasOwnProperty('DRSMetadata')) {
                        uriType = value.DRSMetadata.uriType;
                        uriType = uriType.toLowerCase();
                        drsFileId = value.DRSMetadata.drsFileId; 
                      }
                    });
                  }
                });
              }
              else {
                if (body.items.mods.titleInfo.hasOwnProperty('title')) {
                  title = body.items.mods.titleInfo.title;
                }
                if (body.items.mods.hasOwnProperty('extension')) {
                  Object.entries(body.items.mods.extension).forEach(entry => {
                    const [key, value] = entry;
                    if (value.hasOwnProperty('DRSMetadata')) {
                      uriType = value.DRSMetadata.uriType;
                      uriType = uriType.toLowerCase();
                      drsFileId = value.DRSMetadata.drsFileId; 
                    }
                  });
                }
                  
              }
              console.log('Title: '+title);
              console.log('Type: '+uriType);
              console.log('drsFileId: '+drsFileId);
            }

            itemData = {'title':title, 'uriType':uriType, 'drsFileId':drsFileId};
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
    res.json( 
      {
        type: itemData.uriType,
        version:"1.0",
        provider_name:"MPS Embed",
        title:itemData.title,
        height:400,
        width:null,
        html:"\u003ciframe src=\"/iframe?url=https://viewer-qa.lib.harvard.edu/viewer/"+itemData.uriType+"/"+itemData.drsFileId+"\" height=\"400px\" width=\"100%\" title=\"MPS Viewer\" frameborder=\"0\" marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\" allowfullscreen\u003e\u003c/iframe\u003e\n"
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