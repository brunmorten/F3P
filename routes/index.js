var express = require('express');
var stormpath = require('express-stormpath');
var mongoose = require('mongoose');

var router = express.Router();

var CompetitionModel = mongoose.model('competition');
var FlyingScheduleModel = mongoose.model('flyingschedule');

/* Helper functions */
function findCompetitionsInfos(username, callback) {

  CompetitionModel.find({ 'director': username }, function (err, competitions) {
    
    if (err) {
      console.error(err);
    }
    
    callback(competitions.map(function(element) {
      return { url: "/competition/" + element._id, name: element.name, deleteAction: "/competition/" + element._id + "?_method=DELETE" };
    }));
  });
}

function findFlyingScheduleInfos(callback) {
  
  FlyingScheduleModel.find({}, function(err, flyingSchedules) {
    
    if (err) {
      console.error(err);
    }
    
    callback(flyingSchedules.map(function(element) {
      return { url: "/flyingschedule/" + element._id, name: element.name, deleteAction: "/flyingschedule/" + element._id + "?_method=DELETE" };
    }));
  });
}

/* GET home page. */
router.get('/', stormpath.loginRequired, function (req, res, next) {
  
  findCompetitionsInfos(req.user.username, function (competitionInfos) {
    
    findFlyingScheduleInfos(function (flyingScheduleInfos) {
      
      res.render('index', { activePage: 'Index', competitions: competitionInfos, flyingSchedules: flyingScheduleInfos });
    });
  });
});

module.exports = router;