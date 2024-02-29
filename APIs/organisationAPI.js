const exp = require('express');
const orgApp = exp.Router();
const expressAsynHandler = require('express-async-handler');
const {getStats} = require('../APIs/Controllers/org')
require('dotenv').config()

orgApp.use(exp.json());

orgApp.get('/stats/:org',expressAsynHandler(getStats));



module.exports = orgApp;
