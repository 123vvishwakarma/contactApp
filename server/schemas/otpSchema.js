module.exports = function(app, mongoose) {

  var otpSchema = mongoose.Schema({ 
    "name" : {type : String, default : ''},
    "phoneNumber" : {type: Number,  unique: true},
	"otpNumber": {type: Number, default: ''},
    "dateTime": Date
  });

  var otps = mongoose.model('otps', otpSchema);
  app.schema.otps = otps;
};

