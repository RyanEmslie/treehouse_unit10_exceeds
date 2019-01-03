'use strict'
const express = require('express');
const router = express.Router();

// GET Homepage
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' })
  .then(function(err) {
    res.catch(function(err) {
    return next(err);
  }).render("error", { error: err.errors });
  })
});

module.exports = router;
