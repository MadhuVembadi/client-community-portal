const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');


const replySchema = new mongoose.Schema({
    reply:{
        type:String,
        required:true
    },
    userId:{
        type:ObjectId,
        required:true
    }
})

const commentSchema = new mongoose.Schema({
    comment:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    datePosted:{
        type:Date,
        required:true
    },
    username:{
        type:String,
        required:true
    }
})

const postSchema = new mongoose.Schema({
    userId:{
        type:ObjectId,
        required:true
    },
    post:{
        type:String,
        required:true
    },
    comments:[commentSchema],
    upvotes:[{
        type:String,
        required:true
    }],
    upvotesCount:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true,
        minLength:0
    },
    datePosted:{
        type:Date,
        required:true
    }
})


module.exports = mongoose.model('posts',postSchema)