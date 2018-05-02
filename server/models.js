exports = module.exports = function (app, mongoose) {

	// Schemas
	require('./schemas/otpSchema')(app, mongoose);
	require('./schemas/messageSchema')(app, mongoose);
};