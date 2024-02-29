require('dotenv').config();
const userModel = require('../../models/userModel');
const postModel = require('../../models/postModel');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

async function getUsers(org){
    
    let res = await userModel.find({
        organisation:org
    },{
        notifications:0,password:0
    })

    return res;
}

async function getPosts({org,loggedinUser}){
    let res = await postModel.aggregate([
        {
            $lookup:
            {
                from:"users",
                localField:"userId",
                foreignField:"_id",
                as:"user"
            }
        },
        {
            $unwind:"$user"
        },
        {
            $match:{
                "user.organisation":org
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
            $unset:["comments.commentUser.notifications","user.notifications"]
          }
    ])
    return res;
}

module.exports = {
    getUsers,
    getPosts
}