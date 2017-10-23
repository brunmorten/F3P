var express = require("express");
var mongoose = require("mongoose");
var FlyingScheduleModel = mongoose.model("flyingschedule");
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
    flyingSchedule = new FlyingScheduleModel();
  }
  
  var action = isNew ? "/flyingschedule" : "/flyingschedule/" + flyingSchedule.id;
  var deleteAction = action + "?_method=DELETE";
  var saveAction = isNew ? action + "?_method=POST" : action + "?_method=PUT";
  
  for (var i=0; i<flyingSchedule.manoeuvres.length; i++) {
    
    var manoeuvreAction = "/manoeuvre/" + flyingSchedule.id + "/" + flyingSchedule.manoeuvres[i].id;
    
    flyingSchedule.manoeuvres[i].url = manoeuvreAction;
    flyingSchedule.manoeuvres[i].deleteAction = manoeuvreAction + "?_method=DELETE";
  }
  
  // Add the actions to the object to use in the jade template
  flyingSchedule.addManoeuvreAction = "/manoeuvre/" + flyingSchedule.id;
  flyingSchedule.deleteAction = deleteAction;
  flyingSchedule.saveAction = saveAction;
  flyingSchedule.isNew = isNew;
    
  res.render("flyingschedule", { activePage: 'FlyingSchedule', flyingSchedule: flyingSchedule});
}

/* GET. */
router.get("/", function (req, res) {
  renderFlyingSchedule(res, null);
});

/* GET by id. */
router.get("/:id", function (req, res) {
  FlyingScheduleModel.findOne({ "_id" : req.params.id }, function (err, flyingSchedule) {
    
    if (err) {
      return res.status(500).send("500: Internal Server Error");
    }
    
    renderFlyingSchedule(res, flyingSchedule);
  });
});

/* PUT by id. */
router.put("/:id", function(req, res) {

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
router.delete("/:id", function(req, res) {
  
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
router.post('/', function (req, res) {

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

module.exports = router;