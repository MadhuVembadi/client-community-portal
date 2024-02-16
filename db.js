const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = () => {
    try{
        let url = process.env.DBURL;
        mongoose.connect(url);
    }
    catch(err){
        console.log('error in connecting to the database',err);
    }

    const dbConnection = mongoose.connection;
    dbConnection.once("open",() => {
        console.log('Database connected');
    })

    dbConnection.on("error",() => {
        console.log('Database connection err');
    })
    return;
}

module.exports = connectDB;