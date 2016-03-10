var express = require('express');
var stormpath = require('express-stormpath');
var mongoose = require('mongoose');

var router = express.Router();

var CompetitionModel = mongoose.model('competition');
var FlyingScheduleModel = mongoose.model('flyingschedule');

/* GET home page. */
router.get('/', stormpath.getUser, function (req, res, next) {
  
  var competitionsQuery = CompetitionModel.find({'director': req.user.username});
  var flyginSchedulesQuery = FlyingScheduleModel.find({});
  
  competitionsQuery.exec().then(function (competitions) {
    
    // Map the competitions info we need to render
    var competitionInfos = competitions.map(function(element) {
      return { url: "/competition/" + element._id, name: element.name, deleteAction: "/competition/" + element._id + "?_method=DELETE" };
    });
    
    flyginSchedulesQuery.exec().then(function (flyingSchedules) {
      
      // Map the flying schedules info we need to render
      var flyingScheduleInfos = flyingSchedules.map(function(element) {
        return { url: "/flyingschedule/" + element._id, name: element.name, deleteAction: "/flyingschedule/" + element._id + "?_method=DELETE" };
      });
      
      res.render('index', { activePage: 'Index', competitions: competitionInfos, flyingSchedules: flyingScheduleInfos });
    })
  });
});

module.exports = router;