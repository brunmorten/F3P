var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Comment = new Schema({
  title: String,
});

mongoose.model('comments', Comment);

var uristring = process.env.MONGOLAB_URI;

mongoose.connect(uristring, function (err, res) {
  if (err) {
    console.log('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log('Succeeded connected to: ' + uristring);
  }
});