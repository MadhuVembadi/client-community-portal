const exp = require('express');
const expressAsyncHandler = require('express-async-handler');
const userModel = require('../models/userModel');
const searchApp = exp.Router();

require('dotenv').config()

searchApp.use(exp.json());


searchApp.get('/:searchQuery',expressAsyncHandler(async(request,response) => {
    searchQuery = request.params.searchQuery;
    console.log(searchQuery);
    let res = await userModel.aggregate([
        {
            $search:{
                index:"default",
                "wildcard":{
                    "query":`*${searchQuery}*`,
                    "path":["firstname","lastname","username"],
                    "allowAnalyzedField": true
                }
            }
        }
    ])
    console.log(res);
    response.send({message:"success",users:res});
}))

module.exports = searchApp;