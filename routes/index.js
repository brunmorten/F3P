var express = require('express');
var stormpath = require('express-stormpath');
var router = express.Router();

var mongoose = require('mongoose');

var Competition = mongoose.model('competition');

/* GET home page. */
router.get('/', stormpath.loginRequired, function (req, res, next) {
  Competition.find({ 'director': req.user.username }, function (err, competitions) {
        
    var competitionInfos = competitions.map(function(element) {
      return { url: "competition/" + element._id, name: element.name, deleteAction: "/competition/" + element._id + "?_method=DELETE" };
    });
    
    res.render('index', { activePage: 'Index', competitions: competitionInfos });
  });
});

module.exports = router;