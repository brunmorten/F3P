var express = require('express');
var stormpath = require('express-stormpath');
var router = express.Router();

var mongoose = require('mongoose');

var Competition = mongoose.model('competition');

/* GET home page. */
router.get('/', stormpath.loginRequired, function (req, res, next) {
  Competition.find({ 'director': req.user.username }, function (err, competitions) {
    res.render('index', { activePage: 'Index', competitions: competitions });
  });
});

module.exports = router;