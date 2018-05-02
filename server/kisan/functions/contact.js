var events = require('events');
var otp = require('otplib/lib/totp');

exports.createOtpFunc = function (options, app, callback) {
	let eventEmitter = new events.EventEmitter();

	eventEmitter.on('createOtp', function (options) {
		console.log("Otp  : ",options);
		let secret = otp.utils.generateSecret();
		let otpNumber = otp.generate(secret);
		let otpDoc = {
			name: options.name,
			phoneNumber: options.phoneNumber,
			otpNumber: otpNumber,
			dateTime: Date.now()
		};
		eventEmitter.emit('saveOtpInDb', otpDoc);
	});

	eventEmitter.on('saveOtpInDb', function (otpDoc) {
		let query = {
			phoneNumber: otpDoc.phoneNumber
		};
		let collection = app.schema.otps;
		let selection = {};
		let populateDoc = "";
		app.crud.getOneDoc(query, collection, selection, populateDoc, app, function (err, otpResp) {
			if (err) {
				console.log("Error in finding otp doc",err);
				callback("Error in finding otp doc", "");
			} else if (!otpResp) {
				console.log("Otp Doc : ---",otpDoc);
				app.crud.createDocument(otpDoc, collection, app, function (err, otpDoc) {
					if (err) {
						console.log("Error in creating otp doc",err);
						callback("Error in creating otp doc", "");
					} else {
						//callback("", otpDoc);
						eventEmitter.emit('saveMsgInDb', otpDoc);
					}
				});
			} else {
				let options = {
					new: true
				};
				app.crud.updateDocument(query, otpDoc, collection, options, populateDoc, app, function (err, otpDoc) {
					if (err) {
						console.log("Error in updating otp doc");
						callback("Error in updating otp doc", "");
					} else {
						//callback("", otpDoc);
						eventEmitter.emit('saveMsgInDb', otpDoc);
					}
				});
			}
		});
	});

	eventEmitter.on('saveMsgInDb', function(options) {
		var otpOptions = options;
		let query = {
			phoneNumber: options.phoneNumber
		};
		let collection = app.schema.messages;
		let selection = {};
		let populateDoc = "";
		app.crud.getOneDoc(query, collection, selection, populateDoc, app, function (err, otpResp) {
			if (err) {
				console.log("Error in finding otp doc", err);
				callback("Error in finding otp doc", "");
			} else if (!otpResp) {
				let msg = "Hi. Your OTP is : " + options.otpNumber;
				let msgDoc = {
					name: options.name,
					phoneNumber: options.phoneNumber,
					otpNumber: options.otpNumber,
					message: msg,
					dateTime: Date.now()
				};
				let collection = app.schema.messages;
				app.crud.createDocument(msgDoc, collection, app, function (err, msgDoc) {
					if (err) {
						console.log("Error in creating msg doc", err);
						callback("Error in creating msg doc", "");
					} else {
						callback("", msgDoc);
					}
				});
			} else {
				console.log("options : ",otpOptions);
				let options = {
					new: true
				};
				let msg = "Hi. Your OTP is : " + otpOptions.otpNumber;
				let msgDoc = {$set : 
					{
						name: otpOptions.name,
						otpNumber: otpOptions.otpNumber,
						message: msg,
						dateTime: Date.now()
					}
				};
				app.crud.updateDocument(query, msgDoc, collection, options, populateDoc, app, function (err, msgDoc) {
					if (err) {
						console.log("Error in updating otp doc");
						callback("Error in updating otp doc", "");
					} else {
						callback("", msgDoc);
					}
				});
			}
		});
	});

	if (options.phoneNumber) {
		console.log("options : ---",options.phoneNumber);
		eventEmitter.emit('createOtp', options);
	} else {
		console.log("Phone number not provided for this function: ");
		callback("No Phone Number", "");
	}
};