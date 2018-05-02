module.exports = function (app) {    
    //Get api
    app.get('/contact/contactList', require('../kisan/apis/contactApis').contactList);
    app.get('/contact/getContact/:id', require('../kisan/apis/contactApis').getContact);
    app.get('/contact/getMsgList', require('../kisan/apis/contactApis').getMsgList);

    //Post api
    app.post('/contact/createOtp', require('../kisan/apis/contactApis').createOtp);
    app.post('/contact/sendMsg', require('../kisan/apis/contactApis').sendMsg);
};