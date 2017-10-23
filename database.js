var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Manoeuvre = new Schema({
	name: String,
	description: String,
	k_factor: Number,
});

var FlyingSchedule = new Schema({
	name: String,
	description: String,
	manoeuvres: [Manoeuvre],
});

var PlaneInfo = new Schema({
	name: String,
	description: String,
	motor: String,
	esc: String,
	servos: String,
	weight: Number,
});

var FlyingClass = new Schema({
	name: String,
	description: String,
});

var PilotInfo = new Schema({
	name: String,
	description: String,
	age: Number,
	nlf_id: String,
	plane: PlaneInfo,
	flying_class: FlyingClass,
});

var CompetitionClass = new Schema({
	name: String,
	description: String,
	scedule: FlyingSchedule,
	pilots: [PilotInfo],
});

var Competition = new Schema({
	name: String,
	description: String,
	club: String,
	director: String,
	competition_classes: [CompetitionClass],
});

mongoose.model('manoeuvre', Manoeuvre);
mongoose.model('flyingschedule', FlyingSchedule);
mongoose.model('planeinfo', PlaneInfo);
mongoose.model('flyingclass', FlyingClass);
mongoose.model('pilotinfo', PilotInfo);
mongoose.model('competitionclass', CompetitionClass);
mongoose.model('competition', Competition);

var uristring = process.env.MONGOLAB_URI;

mongoose.connect(uristring, { useMongoClient: true }, function (err, res) {
  
  if (err) {
    console.log('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log('Succeeded connected to: ' + uristring);
  }
});