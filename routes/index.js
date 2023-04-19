const express = require('express');
const router = express.Router();

router.get("/", function (req, res) {

  const idsExamples = [
    {
      "href": "/api/legacy?recordIdentifier=W401849_URN-3:HUL.ARCH:2009749",
      "text": "Harvard University Baseball Team, photograph, 1892"
    },
    {
      "href": "/api/legacy?recordIdentifier=W401827_URN-3:HUL.ARCH:2009747",
      "text": "Harvard-Yale Baseball Game. Holmes Field, photograph, 1885"
    },
    {
      "href": "/api/legacy?recordIdentifier=W587091_URN-3:RAD.SCHL:11680642",
      "text": "To roast a chicken; show #217"
    },
    {
      "href": "/api/legacy?recordIdentifier=HUAM140429_URN-3:HUAM:INV012574P_DYNMC",
      "text": "Untitled Drumset"
    },
    {
      "href": "/api/legacy?recordIdentifier=990100671200203941",
      "text": "Hot Dog In The Manger"
    },
    {
      "href": "/api/legacy?recordIdentifier=990095204340203941",
      "text": "Chronique du monde depuis la création, et des rois de France et d'Angleterre, jusqu'à l'an 1461: manuscript, [ca. 1461]. MS Typ 41. Houghton Library, Harvard University, Cambridge, Mass."
    },
    {
      "href": "/api/legacy?recordIdentifier=990098789400203941",
      "text": "Heures de Nôtre Dame (use of Troyes and Sens) : manuscript, [ca. 1470]"
    }
  ];

  const mpsExamples = [
    {
      "href": "/api/mps?urn=URN-3:DIV.LIB.USC:3200357&manifestVersion=2",
      "text": "Harvard Divinity School Unitarian Service Committee",
      "version": 2
    },
    {
      "href": "/api/mps?urn=URN-3:DIV.LIB.USC:3200357&manifestVersion=3",
      "text": "Harvard Divinity School Unitarian Service Committee",
      "version": 3
    },
    {
      "href": "/api/mps?urn=URN-3:FHCL:42632611&manifestVersion=2",
      "text": "Harvard Yenching Fushun Xian zhi 37 juan",
      "version": 2
    },
    {
      "href": "/api/mps?urn=URN-3:FHCL:42632611&manifestVersion=3",
      "text": "Harvard Yenching Fushun Xian zhi 37 juan",
      "version": 3
    },
    {
      "href": "/api/mps?urn=URN-3:FHCL:100001249&manifestVersion=2",
      "text": "Tibetan Buddhist Resource Center",
      "version": 2
    },
    {
      "href": "/api/mps?urn=URN-3:FHCL:100001249&manifestVersion=3",
      "text": "Tibetan Buddhist Resource Center",
      "version": 3
    }
  ];

    res.render("index", {
      title: "Welcome to MPS Embed!",
      idsExamples: idsExamples,
      mpsExamples: mpsExamples
    });
})

module.exports = router;