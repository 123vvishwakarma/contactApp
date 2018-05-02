module.exports = function(app, mongoose) {

  var messageSchema = mongoose.Schema({ 
    "name" : {type : String, default : ''},
    "phoneNumber" : {type: Number},
    "otpNumber": {type: Number, default: ''},
    "message" : {type: String, default : ''},
    "dateTime":Date
  });

  var messages = mongoose.model('messages', messageSchema);
  app.schema.messages = messages;
};