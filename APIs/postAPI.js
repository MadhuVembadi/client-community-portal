const exp = require('express');
const postApp = exp.Router();
const bodyParser = require('body-parser')
var postModel = require('../models/postModel');
var userModel = require('../models/userModel');
const expressAsyncHandler = require('express-async-handler');
require('dotenv').config();
var cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const multer = require('multer');
const mongoose  = require('mongoose');
const addItemMiddleware = require('./Middlewares/multerMiddleware').addItemMiddleware
const uploadImage = require('./Middlewares/s3upload').uploadImage;

postApp.use(exp.json());
postApp.use(bodyParser.urlencoded({ extended: true }));

const { getPost, createPost, getAllPosts, postLike, postDislike, postComment } = require('./Controllers/post')


// // configure cloudinary
// cloudinary.config({
//     cloud_name:"madhuvembadi",
//     api_key:"396781986163711",
//     api_secret:"V_H-k4NmyrqhXtdd9ua_SSlXiVY",
//     secure:true
// })

// // configure cloudinary storage
// const cloudinaryStorage = new CloudinaryStorage({
//     cloudinary:cloudinary,
//     params:async (req,file) => {

//       if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
//         // You can customize the error message or handle it however you want
//         throw new Error('Formats allowed : jpg/jpeg/png/gif');
//       }

//         return {
//             folder:"mini_project",
//             public_id:file.fieldname + "-" + Date.now()
//         }
//     }
// });

// //configure multer
// var upload = multer({storage:cloudinaryStorage});


postApp.get('/:postId',expressAsyncHandler(getPost));
// postApp.get('/:postId',expressAsyncHandler(async(request,response) => {

//   let postId = request.params.postId;
//   let userId = request.query.user;
//   // console.log(userId);
//   // let post = await postModel.findOne({_id:new mongoose.Types.ObjectId(postId)});
//   let post = await postModel.aggregate([
//     {
//       $match:{_id:new mongoose.Types.ObjectId(postId)}
//     },
//     {
//       $lookup:{
//         from:"users",
//         localField:"userId",
//         foreignField:'_id',
//         as:"user"
//       }
//     },
//     {
//       $addFields:{
//         upvoted:{
//           $cond:{
//             if:{$in:[userId,"$upvotes"]},
//             then:true,
//             else:false
//           }
//         }
//       }
//     }
//   ])
//   // console.log(post);
//   response.send({message:'success',post:post[0]});
// }))

postApp.post('/',addItemMiddleware,expressAsyncHandler(createPost));
// postApp.post('/',addItemMiddleware,expressAsyncHandler(async(request,response) => {
//   console.log(request.file);
//   let imgURL = "none";
//   if(request.file != undefined){
//     imgURL = await uploadImage({imageName:request.file.filename,imagePath:request.file.path})
//     console.log(imgURL);
//   }
//    let postObj = JSON.parse(request.body.post);
//    let newPost = {...postObj,image:imgURL,datePosted:new Date()};
//    console.log(newPost);
//    let newPostToInsert = new postModel(newPost);
//    let res = await newPostToInsert.save();
//    console.log(res);
//    response.send({message:'success',post:newPost})
// }))

postApp.get('/all/:userId',expressAsyncHandler(getAllPosts));
// postApp.get('/all/:userId',expressAsyncHandler(async(request,response) => {

//     let loggedinUser = request.params.userId;
//     let filter = request.query.filter;
//     // console.log(loggedinUser,filter);
//     const pipeline = [
//       {
//         $lookup:{
//           from:"users",
//           localField:"userId",
//           foreignField:"_id",
//           as:"user"
//         }
//       },
//       {
//         $addFields:{
//           upvoted:{
//             $cond:{
//               if:{$in:[loggedinUser,"$upvotes"]},
//               then:true,
//               else:false
//             }
//           }
//         }
//       },
//       {
//         $sort:{
//           [filter]:-1
//         }
//       }
//     ]
//     let documents = await postModel.aggregate(pipeline);
//     // let documents = await postModel.aggregate([
//     //   {
//     //     $lookup:{
//     //       from:"users",
//     //       localField:"userId",
//     //       foreignField:"_id",
//     //       as:"user"
//     //     }
//     //   },
//     //   {
//     //     $addFields:{
//     //       upvoted:{
//     //         $cond:{
//     //           if:{$in:[loggedinUser,"$upvotes"]},
//     //           then:true,
//     //           else:false
//     //         }
//     //       }
//     //     }
//     //   },
//     //   {
//     //     $sort:{
//     //       datePosted:-1
//     //     }
//     //   }
//     // ])
//     // console.log(documents);
//     response.send({message:'success',feed:documents})
// }))


postApp.put('/like',expressAsyncHandler(postLike));
// postApp.put('/like',expressAsyncHandler(async(request,response) => {
//     let obj = request.body;
//     let res = await postModel.updateOne(
//       {
//         _id:obj.postId
//       },
//       {
//         $push:{upvotes:obj.userId},
//         $inc:{upvotesCount:1}
//       }
//     );
//     // console.log(res);
//     if(res.modifiedCount == 1) response.send({message:'success'}); 
//     else response.send({message:'failure'})
    
// }))

postApp.put('/dislike',expressAsyncHandler(postDislike));
// postApp.put('/dislike',expressAsyncHandler(async(request,response) => {
//     let obj = request.body;
//     let res = await postModel.updateOne({_id:obj.postId},{$pull:{upvotes:obj.userId},$inc:{upvotesCount:-1}})
//     if(res.modifiedCount == 1) response.send({message:'success'});  
//     else response.send({message:'failure'})
// }))

postApp.put('/comment',expressAsyncHandler(postComment));
// postApp.put('/comment',expressAsyncHandler(async (request,response) => {
//   let obj = request.body;
//   // console.log(obj);
//   let commentObj = {
//     comment:obj.comment,
//     userId:obj.userId,
//     username:obj.username,
//     datePosted:new Date()
//   }
//   let res = await postModel.updateOne({_id:obj.postId},{$push:{comments:commentObj}});
//   // console.log(res);
//   if(res.modifiedCount == 1) response.send({message:'success',comment:commentObj});
//   else response.send({message:'failure'});
// }))

module.exports = postApp;