var express = require('express');
var mongoose = require('mongoose');
var stormpath = require('express-stormpath');
var Competition = mongoose.model('competition');
var router = express.Router();

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

/* GET page. */
router.get("/", stormpath.loginRequired, function (req, res) {
  renderCompetition(res, null);
});

/* GET page. */
router.get("/:id", stormpath.loginRequired, function (req, res) {
  Competition.findOne({ "_id" : req.params.id }, function (err, competition) {
    renderCompetition(res, competition);
  });
});

router.put("/:id", stormpath.loginRequired, function(req, res) {
  /*
  name: String,
	description: String,
	club: String,
	director: String,
	competition_classes: [CompetitionClass],
  */
  var id = req.params.id;
  Competition.findOne({_id: id}, function(err, competition) {
    
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

router.delete("/:id", stormpath.loginRequired, function(req, res) {
  
  var id = req.params.id;
  Competition.findOneAndRemove({_id: id}, function(err, competition) {
    
    if (err) {
      return res.status(500).send("500: Internal Server Error");
    }
    
    if (!competition) {
      return res.end('No such competition');
    }
    
    res.redirect('/');
  });
});

/* POST competition. */
router.post('/', stormpath.loginRequired, function (req, res) {
  /*
  name: String,
	description: String,
	club: String,
	director: String,
	competition_classes: [CompetitionClass],
  */
  var newCompetition = new Competition({
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