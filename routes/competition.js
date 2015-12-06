var express = require('express');
var mongoose = require('mongoose');
var Competition = mongoose.model('competition');
var router = express.Router();

/* GET page. */
router.get('/', function (req, res) {
  Competition.find(function (err, competitions) {
    res.render(
      'competition',
      { name: 'Competition', competitions: competitions }
      );
  });
});

/* POST competition. */
router.post('/', function (req, res) {
  new Competition({ name: req.body.name })
    .save(function (err, competition) {
      console.log(competition)
      res.redirect('/competition');
    });
});

module.exports = router;