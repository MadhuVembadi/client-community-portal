var postModel = require('../../models/postModel');
var userModel = require('../../models/userModel');
require('dotenv').config();
const mongoose  = require('mongoose');
const addItemMiddleware = require('../Middlewares/multerMiddleware').addItemMiddleware
const uploadImage = require('../Middlewares/s3upload').uploadImage;

async function getPost({postId,userId}){

    let post = await postModel.aggregate([
        {
          $match:{_id:new mongoose.Types.ObjectId(String(postId))}
        },
        {
          $lookup:{
            from:"users",
            localField:"userId",
            foreignField:'_id',
            as:"user"
          }
        },
        {
          $addFields:{
            upvoted:{
              $cond:{
                if:{$in:[userId,"$upvotes"]},
                then:true,
                else:false
              }
            }
          }
        },
        {
          $unwind:{ 
            path:"$comments",
            preserveNullAndEmptyArrays:true
          }
        },       
        {
          $lookup: {
              from: "users",
              let:{userIdStr : "$comments.userId"},
              pipeline:[
                {
                  $match:{
                    $expr:{
                      $eq:[
                        {$toString: "$_id"},
                        "$$userIdStr"
                      ]
                    }
                  }
                }
              ],   
              // localField: "comments.username",
              // foreignField: "username",
              as: "comments.commentUser"
          }
        },
        {
          $addFields: {
            "comments": {
              $cond: {
                if: { $eq: ["$comments", { commentUser: []}] }, 
                then: "$REMOVE", 
                else: "$comments"
              }
            }
          }
        },        
        {
          $group:{
            _id:"$_id",
            "comments":{
              $push:"$comments"
            },
            "userId":{$first:"$userId"},
            "post":{$first:"$post"},
            "upvotes":{$first:"$upvotes"},
            "upvotesCount":{$first:"$upvotesCount"},
            "image":{$first:"$image"},
            "datePosted":{$first:"$datePosted"},
            "user":{$first:"$user"},
            "upvoted":{$first:"$upvoted"}
          }
        },
      ])
      return {message:'success',post:post[0]};
}

async function createPost(newPost){

   let newPostToInsert = new postModel(newPost);
   let res = await newPostToInsert.save();
   return {message:'success',post:newPost};

}

async function getAllPosts ({loggedinUser,filter}) {
    const pipeline = [
        {
          $lookup:{
            from:"users",
            localField:"userId",
            foreignField:"_id",
            as:"user"
          }
        },
        {
          $addFields:{
            upvoted:{
              $cond:{
                if:{$in:[loggedinUser,"$upvotes"]},
                then:true,
                else:false
              }
            }
          }
        },
        {
          $unwind:{ 
            path:"$comments",
            preserveNullAndEmptyArrays:true
          }
        },       
        {
          $lookup: {
              from: "users",
              let:{userIdStr : "$comments.userId"},
              pipeline:[
                {
                  $match:{
                    $expr:{
                      $eq:[
                        {$toString: "$_id"},
                        "$$userIdStr"
                      ]
                    }
                  }
                }
              ],   
              // localField: "comments.username",
              // foreignField: "username",
              as: "comments.commentUser"
          }
        },
        {
          $addFields: {
            "comments": {
              $cond: {
                if: { $eq: ["$comments", { commentUser: []}] }, 
                then: "$REMOVE", 
                else: "$comments"
              }
            }
          }
        },        
        {
          $group:{
            _id:"$_id",
            "comments":{
              $push:"$comments"
            },
            "userId":{$first:"$userId"},
            "post":{$first:"$post"},
            "upvotes":{$first:"$upvotes"},
            "upvotesCount":{$first:"$upvotesCount"},
            "image":{$first:"$image"},
            "datePosted":{$first:"$datePosted"},
            "user":{$first:"$user"},
            "upvoted":{$first:"$upvoted"}
          }
        },
        {
          $sort:{
            [filter]:-1
          }
        },
      ]
      let documents = await postModel.aggregate(pipeline);
      return {message:'success',feed:documents};
}

async function likePost(obj){
    let res = await postModel.updateOne(
        {
            _id:obj.postId
        },
        {
            $push:{upvotes:obj.userId},
            $inc:{upvotesCount:1}
        }
    );
    if(res.modifiedCount == 1) return {message:'success'}; 
    else return {message:'failure'}
}

async function dislikePost(obj) {
    let res = await postModel.updateOne({_id:obj.postId},{$pull:{upvotes:obj.userId},$inc:{upvotesCount:-1}})
    if(res.modifiedCount == 1) return {message:'success'} 
    else return {message:'failure'}
}

async function commentPost(obj,commentObj) {
    console.log(commentObj);
    let res = await postModel.updateOne(
      {
        _id:obj.postId
      },
      {
        $push:{
          comments:{
            $each:[commentObj],
            $position:0
          }
        }
      }
    );
    // console.log(res);
    if(res.modifiedCount == 1) return {message:'success',comment:commentObj}
    else return {message:'failure'}
}
module.exports = {
    getPost,
    createPost,
    getAllPosts,
    likePost,
    dislikePost,
    commentPost
}