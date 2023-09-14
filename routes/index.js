const express = require('express');
const router = express.Router();
const examplesCtrl = require('../controllers/examples.ctrl');
const consoleLogger = require('../logger/logger.js').console;

router.get("/", async (req, res) => {

    let exampleItems = {idsExamples: [], mpsExamples: []};
    try {
      exampleItems = await examplesCtrl.getExamples('example-items.json');
    } catch(e) {
      consoleLogger.error(e);
    }
    
    const idsExamples = exampleItems.idsExamples;
    const mpsExamples = exampleItems.mpsExamples;

    res.render("index", {
      title: "Welcome to MPS Embed!",
      idsExamples: idsExamples,
      mpsExamples: mpsExamples
    });
})

module.exports = router;