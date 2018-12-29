const express = require('express');
const router = express.Router();
const models = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' })
  console.log('dude')
  .catch(function(err) {
    return next(err);
  }).then(function(err) {
    res.render("error", { error: err.errors });
  })
  .catch(function(err) {
    res.sendStatus(500);
  })
  .catch(function(err) {
    res.sendStatus(404);
  });
});

module.exports = router;
