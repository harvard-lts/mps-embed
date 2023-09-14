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

legacyManifestsCtrl.setDRSId = (extension, data) => {
  Object.entries(extension).forEach(entry => {
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
  return data;
}

legacyManifestsCtrl.setTitle = (titleInfo, data) => {
  if (titleInfo.length) {
    if (titleInfo[0].hasOwnProperty('title')) {
      data.title = titleInfo[0].title;
    }
  }
  else {
    if (titleInfo.hasOwnProperty('title')) {
      data.title = titleInfo.title;
    }
  }
  return data;
}

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
          data = legacyManifestsCtrl.setTitle(value.titleInfo, data);
          if (value.hasOwnProperty('extension')) {
            data = legacyManifestsCtrl.setDRSId(value.extension, data);
          }
        });
      }
      else {
        data = legacyManifestsCtrl.setTitle(record.data.items.mods.titleInfo, data);
        if (record.data.items.mods.hasOwnProperty('extension')) {
          data = legacyManifestsCtrl.setDRSId(record.data.items.mods.extension, data);
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