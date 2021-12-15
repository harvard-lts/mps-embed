const https = require('https');
const axios = require('axios');

const httpCtrl = {};

httpCtrl.getItem = async (recordIdentifier) => {
    let result = {};
  
    let response;
    try {
      response = await axios.get('https://api.lib.harvard.edu/v2/items.json?recordIdentifier='+recordIdentifier);
    } catch(e) {
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

  httpCtrl.getData = async (record) => {

    let data = {
        title: '',
        uriType: '',
        drsFileId: '',    
      };

      if (record.data.items.hasOwnProperty('mods')) {
        if (record.data.items.mods.length) {
          Object.entries(record.data.items.mods).forEach(entry => {
            const [key, value] = entry;
            if (value.titleInfo.length) {
              if (value.titleInfo[0].hasOwnProperty('title')) {
                data.title = value.titleInfo[0].title;
              }
            }
            else {
              if (value.titleInfo.hasOwnProperty('title')) {
                data.title = value.titleInfo.title;
              }
            }
            if (value.hasOwnProperty('extension')) {
              Object.entries(value.extension).forEach(entry => {
                const [key, value] = entry;
                if (value.hasOwnProperty('DRSMetadata')) {
                  data.uriType = value.DRSMetadata.uriType;
                  data.uriType = data.uriType.toLowerCase();
                  if (value.DRSMetadata.hasOwnProperty('drsFileId')) {
                    data.drsFileId = value.DRSMetadata.drsFileId;
                  }
                  else {
                    if (value.DRSMetadata.hasOwnProperty('drsObjectId')) {
                      data.uriType = 'drs';
                      data.drsFileId = value.DRSMetadata.drsObjectId;
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
              data.title = record.data.items.mods.titleInfo[0].title;
            }
          }
          else {
            if (record.data.items.mods.titleInfo.hasOwnProperty('title')) {
              data.title = record.data.items.mods.titleInfo.title;
            }
          }
          if (record.data.items.mods.hasOwnProperty('extension')) {
            Object.entries(record.data.items.mods.extension).forEach(entry => {
              const [key, value] = entry;
              if (value.hasOwnProperty('DRSMetadata')) {
                data.uriType = value.DRSMetadata.uriType;
                data.uriType = data.uriType.toLowerCase();
                if (value.DRSMetadata.hasOwnProperty('drsFileId')) {
                  data.drsFileId = value.DRSMetadata.drsFileId;
                }
                else {
                  if (value.DRSMetadata.hasOwnProperty('drsObjectId')) {
                    data.uriType = 'drs';
                    data.drsFileId = value.DRSMetadata.drsObjectId;
                  }
                }
              }
            });
          }
            
        }
      }

      return data;
  };  

module.exports = httpCtrl;