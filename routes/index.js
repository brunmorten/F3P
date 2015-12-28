var express = require('express');
var stormpath = require('express-stormpath');
var router = express.Router();

var mongoose = require('mongoose');

var Competition = mongoose.model('competition');

/* GET home page. */
router.get('/', stormpath.loginRequired, function (req, res, next) {
  Competition.find({ 'director': req.user.username }, function (err, competitions) {
    
    var competitionInfos = [];
    competitions.forEach(function(element) {
      competitionInfos.push({ url: "competition/create/" + element._id, name: element.name });
    }, this);
    
    res.render('index', { activePage: 'Index', competitions: competitionInfos });
  });
});

module.exports = router;