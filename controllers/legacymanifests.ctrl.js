const httpCtrl = require('./http.ctrl');
const consoleLogger = require('../logger/logger.js').console;

const legacyManifestsCtrl = {};

legacyManifestsCtrl.getItem = async (recordIdentifier) => {

  // Set request values that are specific to this route
  const requestOptionsData = {
    method: 'GET',
    url: `https://api.lib.harvard.edu/v2/items.json?recordIdentifier=${recordIdentifier}`
  };

  return httpCtrl.makeRequest(requestOptionsData);

};

legacyManifestsCtrl.getData = async (record) => {

  let data = {
      title: '',
      uriType: '',
      drsFileId: '',    
  };

  if (record.data.items !== null) {

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
  }
  return data;
};

legacyManifestsCtrl.getManifest = async (recordIdentifier) => {
  let data, record;
  try {
    record = await legacyManifestsCtrl.getItem(recordIdentifier);
  } catch(e) {
    consoleLogger.error(e);
    throw new Error(e);
  }

  try {
    data = await legacyManifestsCtrl.getData(record);
  } catch(e) {
    consoleLogger.error(e);
    throw new Error(e);
  }
  return data;
};

module.exports = legacyManifestsCtrl;
