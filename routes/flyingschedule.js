var express = require('express');
var mongoose = require('mongoose');
var stormpath = require('express-stormpath');
var FlyingScheduleModel = mongoose.model('flyingschedule');
var router = express.Router();

/* Model
  name: String,
	description: String,
	manoeuvres: [Manoeuvre],
*/

/* Helper functions */
function renderFlyingSchedule(res, flyingSchedule) {
  
  var isNew = !flyingSchedule;
  
  if (isNew) {
    flyingSchedule = {};  
  }
  
  var action = isNew ? "/flyingschedule" : "/flyingschedule/" + flyingSchedule.id;
  var deleteAction = action + "?_method=DELETE";
  var saveAction = isNew ? action + "?_method=POST" : action + "?_method=PUT";
    
  res.render("flyingschedule", { activePage: 'FlyingSchedule', flyingSchedule: flyingSchedule, deleteAction: deleteAction, saveAction: saveAction, isNew: isNew });
}

/* GET. */
router.get("/", stormpath.loginRequired, function (req, res) {
  renderFlyingSchedule(res, null);
});

/* GET by id. */
router.get("/:id", stormpath.loginRequired, function (req, res) {
  FlyingScheduleModel.findOne({ "_id" : req.params.id }, function (err, flyingSchedule) {
    renderFlyingSchedule(res, flyingSchedule);
  });
});

/* PUT by id. */
router.put("/:id", stormpath.loginRequired, function(req, res) {

  var id = req.params.id;
  FlyingScheduleModel.findOne({_id: id}, function(err, flyingSchedule) {
    
    if (err) {
      return res.status(500).send("500: Internal Server Error");
    }
    
    if (!flyingSchedule) {
      return res.end("No such competition");
    }
    
    flyingSchedule.name = req.body.name ? req.body.name : flyingSchedule.name;
    flyingSchedule.description = req.body.descriptionv ? req.body.description : flyingSchedule.description;
    
    flyingSchedule.save(function(err, flyingSchedule) {
      
      if (err) {
        return res.status(500).send("500: Internal Server Error");
      }
      
      if (!flyingSchedule) {
        return res.end("No such flying schedule");
      }
      
      res.redirect('/');
    });
  });
});

/* Delete by id. */
router.delete("/:id", stormpath.loginRequired, function(req, res) {
  
  var id = req.params.id;
  
  FlyingScheduleModel.findOneAndRemove({_id: id}, function(err, flyingSchedule) {
    
    if (err) {
      return res.status(500).send("500: Internal Server Error");
    }
    
    if (!flyingSchedule) {
      return res.end('No such flying schedule');
    }
    
    res.redirect('/');
  });
});

/* POST flying schedule. */
router.post('/', stormpath.loginRequired, function (req, res) {

  var newFlyingSchedule = new FlyingScheduleModel({
    name: req.body.name,
    description: req.body.description,
    manoeuvres: [ {} ]
  });

  newFlyingSchedule.save(function (err, flyingSchedule) {
    res.redirect('/');
  });
});

module.exports = router;