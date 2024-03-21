const exp = require('express');
const callRecordApp = exp.Router();
const expressAsyncHandler = require('express-async-handler');
require('dotenv').config();
callRecordApp.get('/notificationClient',expressAsyncHandler(async(request,response) => {
    console.log(request);
    response.send(request.token);
}))
module.exports = callRecordApp;