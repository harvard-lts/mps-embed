const express = require('express');
const router = express.Router();
const qs = require('query-string');
const eta = require('eta');

const { body,validationResult } = require('express-validator');

router.get("/", function (req, res) {
    res.render("index", {
        title: "Docker NodeJS Template!",
        body: "Hello, World!",
    });
})

module.exports = router;