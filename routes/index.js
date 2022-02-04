const express = require('express');
const router = express.Router();
const qs = require('query-string');
const eta = require('eta');

const { body,validationResult } = require('express-validator');

router.get("/", function (req, res) {
    res.render("index", {
        title: "Welcome to MPS Embed!",
    });
})

module.exports = router;