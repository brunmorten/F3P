var express = require('express');
var mongoose = require('mongoose');
var FlyingScheduleModel = mongoose.model("flyingschedule");
var ManoeuvreModel = mongoose.model("manoeuvre");
var router = express.Router();

/* Manoeuvre
	name: String,
	description: String,
	k_factor: Number,
*/

/* Helper functions */
function renderManoeuvre(res, flyingSchedule, manoeuvre) {
  
  var isNew = !manoeuvre;
  
  if (isNew) {
    manoeuvre = new ManoeuvreModel();
  }
  
  var action = isNew ? 
    "/manoeuvre/" + flyingSchedule.id : 
    "/manoeuvre/" + flyingSchedule.id + "/" + manoeuvre.id;
  
  var deleteAction = action + "?_method=DELETE";
  var saveAction = isNew ? action + "?_method=POST" : action + "?_method=PUT";
  
  // Add the actions to the object to use in the jade template
  manoeuvre.deleteAction = deleteAction;
  manoeuvre.saveAction = saveAction;
  manoeuvre.isNew = isNew;
    
  res.render("manoeuvre", { activePage: 'Manoeuvre', manoeuvre: manoeuvre});
}

/* GET new for flyingschedule id */
router.get("/:flyingScheduleId", function (req, res) {
  
  var flyingScheduleId = req.params.flyingScheduleId;
  
  FlyingScheduleModel.findOne({ "_id": flyingScheduleId }, function (err, flyingSchedule) {
    
    if (err) {
      return res.status(500).send("500: Internal Server Error");
    }
    
    if (!flyingSchedule) {
      return res.end("No such flying schedule");
    }
    
    renderManoeuvre(res, flyingSchedule, null);
  });
});

/* GET by flyingschedule id and manoeuvre id. */
router.get("/:flyingScheduleId/:manoeuvreId", function (req, res) {
  
  var flyingScheduleId = req.params.flyingScheduleId;
  var manoeuvreId = req.params.manoeuvreId;
  
  FlyingScheduleModel.findOne({ "_id": flyingScheduleId }, function (err, flyingSchedule) {
    
    if (err) {
      return res.status(500).send("500: Internal Server Error");
    }
    
    if (!flyingSchedule) {
      return res.end("No such flying schedule");
    }
    
    var manoeuvre = flyingSchedule.manoeuvres.id(manoeuvreId);
    if (!manoeuvre) {
      return res.end("No such manoeuvre");
    }
    
    renderManoeuvre(res, flyingSchedule, manoeuvre);
  });
});

/* PUT by flyingschedule id and manoeuvre id. */
router.put("/:flyingScheduleId/:manoeuvreId", function(req, res) {
  
  var flyingScheduleId = req.params.flyingScheduleId;
  var manoeuvreId = req.params.manoeuvreId;

  FlyingScheduleModel.findOne({ _id: flyingScheduleId }, function(err, flyingSchedule) {
    
    if (err) {
      return res.status(500).send("500: Internal Server Error");
    }
    
    if (!flyingSchedule) {
      return res.end("No such flying schedule");
    }
    
    var manoeuvre = flyingSchedule.manoeuvres.id(manoeuvreId);
    if (!manoeuvre) {
      return res.end("No such manoeuvre");
    }
    
    manoeuvre.name = req.body.name ? req.body.name : manoeuvre.name;
    manoeuvre.description = req.body.description ? req.body.description : manoeuvre.description;
    manoeuvre.k_factor = req.body.kfactor ? req.body.kfactor : manoeuvre.k_factor;
    
    flyingSchedule.save(function(err) {
      
      if (err) {
        return res.status(500).send("500: Internal Server Error");
      }
      
      res.redirect("/flyingschedule/"+ flyingScheduleId);
    });
  });
});

/* Delete by flyingschedule id and manoeuvre id. */
router.delete("/:flyingScheduleId/:manoeuvreId", function(req, res) {
  
  var flyingScheduleId = req.params.flyingScheduleId;
  var manoeuvreId = req.params.manoeuvreId;
  
  FlyingScheduleModel.findOne({_id: flyingScheduleId}, function(err, flyingSchedule) {
    
    if (err) {
      return res.status(500).send("500: Internal Server Error");
    }
    
    if (!flyingSchedule) {
      return res.end('No such flying schedule');
    }
    
    flyingSchedule.manoeuvres.id(manoeuvreId).remove();
    
    flyingSchedule.save(function(err) {
      
      if (err) {
        return res.status(500).send("500: Internal Server Error");
      }
      
      res.redirect("/flyingschedule/"+ flyingScheduleId);
    });
  });
});

/* POST manoeuvre to flyingSchedule. */
router.post('/:flyingScheduleId', function (req, res) {
  
  var flyingScheduleId = req.params.flyingScheduleId;

  FlyingScheduleModel.findOne({_id: flyingScheduleId}, function(err, flyingSchedule) {
    
    if (err) {
      return res.status(500).send("500: Internal Server Error");
    }
    
    if (!flyingSchedule) {
      return res.end('No such flying schedule');
    }
    
    var newManoeuvre = new ManoeuvreModel({
      name: req.body.name,
      description: req.body.description,
      k_factor: req.body.kfactor
    });
    
    flyingSchedule.manoeuvres.push(newManoeuvre);
    
    flyingSchedule.save(function(err) {
      
      if (err) {
        return res.status(500).send("500: Internal Server Error");
      }
      
      res.redirect("/flyingschedule/"+ flyingScheduleId);
    });
  });
});

module.exports = router;