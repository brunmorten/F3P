var express = require('express');
var mongoose = require('mongoose');
var stormpath = require('express-stormpath');
var CompetitionModel = mongoose.model('competition');
var router = express.Router();

/* Model
  name: String,
	description: String,
	club: String,
	director: String,
	competition_classes: [CompetitionClass],
*/

/* Helper functions */
function renderCompetition(res, competition) {
  
  var isNew = !competition;
  
  if (isNew) {
    competition = {};  
  }
  
  var action = isNew ? "/competition" : "/competition/" + competition.id;
  var deleteAction = action + "?_method=DELETE";
  var saveAction = isNew ? action + "?_method=POST" : action + "?_method=PUT";
    
  res.render("competition", { activePage: 'Competition', competition: competition, deleteAction: deleteAction, saveAction: saveAction, isNew: isNew });
}

/* GET. */
router.get("/", stormpath.loginRequired, function (req, res) {
  renderCompetition(res, null);
});

/* GET by id. */
router.get("/:id", stormpath.loginRequired, function (req, res) {
  CompetitionModel.findOne({ "_id" : req.params.id }, function (err, competition) {
    renderCompetition(res, competition);
  });
});

/* PUT by id. */
router.put("/:id", stormpath.loginRequired, function(req, res) {

  var id = req.params.id;
  CompetitionModel.findOne({_id: id}, function(err, competition) {
    
    if (err) {
      return res.status(500).send("500: Internal Server Error");
    }
    
    if (!competition) {
      return res.end("No such competition");
    }
    
    competition.name = req.body.name ? req.body.name : competition.name;
    competition.description = req.body.descriptionv ? req.body.description : competition.description;
    competition.club = req.body.club ? req.body.club : competition.club;
    competition.director = req.body.director ? req.body.director : competition.director;
    
    competition.save(function(err, competition) {
      
      if (err) {
        return res.status(500).send("500: Internal Server Error");
      }
      
      if (!competition) {
        return res.end("No such competition");
      }
      
      res.redirect('/');
    });
  });
});

/* DELETE by id. */
router.delete("/:id", stormpath.loginRequired, function(req, res) {
  
  var id = req.params.id;
  
  // TODO: Figure out the logic for who can modify and delete competitions
  CompetitionModel.findOne({_id: id}, function(err, competition) {
    
    if (err) {
      return res.status(500).send("500: Internal Server Error");
    }
    
    if (!competition) {
      return res.end("No such competition");
    }
    
    if (competition.director != req.user.username) {
      return res.status(500).send("500: Only the owner can delete this competition");
    }
  });
  
  CompetitionModel.findOneAndRemove({_id: id}, function(err, competition) {
    
    if (err) {
      return res.status(500).send("500: Internal Server Error");
    }
    
    if (!competition) {
      return res.end('No such competition');
    }
    
    res.redirect('/');
  });
});

/* POST. */
router.post('/', stormpath.loginRequired, function (req, res) {
  
  var newCompetition = new CompetitionModel({
    name: req.body.name,
    description: req.body.description,
    club: req.body.club,
    director: req.user.username,
    competition_classes: [ {} ]
  });

  newCompetition.save(function (err, competition) {
    res.redirect('/');
  });
});

module.exports = router;