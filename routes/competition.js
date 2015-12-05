var express = require('express');
var mongoose = require('mongoose');
var Comment = mongoose.model('comments');
var router = express.Router();

/* GET page. */
router.get('/', function (req, res) {
  Comment.find(function (err, comments) {
    res.render(
      'competition',
      { title: 'Competition', comments: comments }
      );
  });
});

/* POST competition comment. */
router.post('/', function (req, res) {
  new Comment({ title: req.body.comment })
    .save(function (err, comment) {
      console.log(comment)
      res.redirect('/competition');
    });
});

module.exports = router;