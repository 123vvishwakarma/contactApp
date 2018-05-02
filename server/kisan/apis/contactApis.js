var async = require('async');
var Nexmo = require('nexmo');

exports.contactList = function(req, res){
	res.status(200).json({
		message: "success",
		data: res.app.config.contactList,
		res: true
	});
}


exports.getContact = function(req, res){
	let contactId = req.params.id;
	let contactDetails = res.app.config.contactList;
	let responseObj = {};
	async.forEach(contactDetails, function(contact, contactCallback) {
		if (contactId == contact._id) {
			responseObj = contact;
		}
		contactCallback();
	}, function(err) {
		if (err) {
			res.status(500).json({
				message: "Error occured",
				data: {},
				res: false
			});
		} else {
			res.status(200).json({
				message: "success",
				data: responseObj,
				res: true
			});
		}
	});
}

exports.createOtp = function(req, res) {
	req.app.contact.createOtpFunc(req.body, req.app, function (err, doc) {
		if (err) {
			res.status(500).json({
				message: err,
				data: {},
				res: false
			});
		} else {
			delete doc.name;
			delete doc._id;
			delete doc.otpNumber;
			delete doc.message;
			res.status(200).json({
				message: "success",
				data: doc,
				res: true
			});
		}
	});
}

exports.getMsgList = function(req, res) {
	var collection = req.app.schema.messages;
	var query = {};
	var selection = "";
	req.app.crud.getAll(query, collection, selection, req.app, function (err, contactList) {
		if (err) {
			res.status(500).json({
				message: "Error occured",
				data: {},
				res: false
			});
		} else {
			delete contactList[0]._id;
			delete contactList[0].message;
			delete contactList[0].phoneNumber;
			res.status(200).json({
				message: "success",
				data: contactList,
				res: true
			});
		}
	});
}

exports.sendMsg = function(req, res) {
	const nexmo = new Nexmo({
		apiKey: 'cbf01425',
	  	apiSecret: 'R5NNRqoAVrmmGsfr'
	});
	const from = 'Kisan Technology';
	const to = "91" + req.body.phoneNumber;
	const text = req.body.message;

	nexmo.message.sendSms(from, to, text, (error, response) => {
		if(error) {
	  		res.status(500).json({
				message: "Error occured sending sms",
				data: {},
				res: false
			});
	  	} else if(response.messages[0].status != '0') {
	    	res.status(500).json({
				message: "Non White-listed Destination - rejected by Nexmo",
				data: {},
				res: false
			});
	  	} else {
	    	res.status(200).json({
				message: "Message sent Successfully",
				data: {},
				res: true
			});
	  	}
	});
}