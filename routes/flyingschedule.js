var express = require("express");
var mongoose = require("mongoose");
var stormpath = require("express-stormpath");
var FlyingScheduleModel = mongoose.model("flyingschedule");
var ManoeuvreModel = mongoose.model("manoeuvre");
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
  
  for (var manoeuvre in flyingSchedule.manoeuvres) {
    manoeuvre.url = "/manoeuvre/" + flyingSchedule.id + "/" + manoeuvre.id;
    manoeuvre.deleteAction = "/manoeuvre/" + flyingSchedule.id + "/" + manoeuvre.id + "?_method=DELETE";
  }
  
  // Add the actions to the object to use in the jade template
  flyingSchedule.addManoeuvreAction = "/manoeuvre/" + flyingSchedule.id;
  flyingSchedule.deleteAction = deleteAction;
  flyingSchedule.saveAction = saveAction;
  flyingSchedule.isNew = isNew;
    
  res.render("flyingschedule", { activePage: 'FlyingSchedule', flyingSchedule: flyingSchedule});
}

/* GET. */
router.get("/", stormpath.loginRequired, function (req, res) {
  renderFlyingSchedule(res, null);
});

/* GET by id. */
router.get("/:id", stormpath.loginRequired, function (req, res) {
  FlyingScheduleModel.findOne({ "_id" : req.params.id }, function (err, flyingSchedule) {
    
    if (err) {
      return res.status(500).send("500: Internal Server Error");
    }
    
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
      return res.end("No such flying schedule");
    }
    
    flyingSchedule.name = req.body.name ? req.body.name : flyingSchedule.name;
    flyingSchedule.description = req.body.description ? req.body.description : flyingSchedule.description;
    flyingSchedule.manoeuvres = req.body.manoevres ? req.body.manoevres : flyingSchedule.manoevres;
    
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
    description: req.body.description
  });

  newFlyingSchedule.save(function (err, flyingSchedule) {
    
    if (err) {
      return res.status(500).send("500: Internal Server Error");
    }
    
    res.redirect('/');
  });
});

/* Manoeuvres section. */

/* Post manoeuvre. */
router.post("/:id/manoeuvre", stormpath.loginRequired, function(req, res) {

  var id = req.params.id;
  FlyingScheduleModel.findOne({_id: id}, function(err, flyingSchedule) {
    
    if (err) {
      return res.status(500).send("500: Internal Server Error");
    }
    
    if (!flyingSchedule) {
      return res.end("No such flying schedule");
    }
    
    var manoeuvre = new ManoeuvreModel({
      name: req.body.name,
      description: req.body.description,
      k_factor: req.body.kfactor,
    });
    
    flyingSchedule.manoeuvres.push(manoeuvre);
    
    flyingSchedule.save(function(err, flyingSchedule) {
      
      if (err) {
        return res.status(500).send("500: Internal Server Error");
      }
      
      if (!flyingSchedule) {
        return res.end("No such flying schedule");
      }
      
      res.redirect("/flyingschedule/" + id);
    });
  });
});


module.exports = router;