var express = require('express');
var mongoose = require('mongoose');
var stormpath = require('express-stormpath');
var Competition = mongoose.model('competition');
var router = express.Router();

/* GET page. */
router.get('/', stormpath.loginRequired, function (req, res) {
  Competition.find(function (err, competitions) {
    res.render('competition', { activePage: 'Competition', competitions: competitions });
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
  });

  newCompetition.save(function (err, competition) {
    console.log(competition)
    res.redirect('/competition');
  });
});

module.exports = router;