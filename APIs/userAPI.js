const exp = require('express');
const userApp = exp.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')
const expressAsynHandler = require('express-async-handler');
var userModel = require('../models/userModel');
var postModel = require('../models/postModel');
const { default: mongoose } = require('mongoose');
const verifyPassword = require('./Middlewares/verifyPassword')
const nodemailer = require('nodemailer');
const authorize = require('./Middlewares/authorize').authorize;

const {
    userSignup,
    userLogin,
    userLogout,
    getUserPosts,
    getUser,
    toggleNotifications,
    updateEmail,
    updatePassword,
    forgotUpdate,
    deleteAccount,
    sendOTP
} = require('../APIs/Controllers/user');

require('dotenv').config()

userApp.use(exp.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAILID,
      pass: process.env.MAILPASS
    }
  });


function getRandomNumber() {
    return Math.floor(Math.random() * 9000) + 1000;
}

userApp.post('/signup',expressAsynHandler(userSignup))
// userApp.post('/signup',expressAsynHandler(async (request,response) => {

//     let newUser = request.body;
//     console.log(newUser);
//     let alreadyExists = await userModel.find({
//         username:newUser.username
//     })

//     if(alreadyExists.length > 0) {
//         response.send({message:'username taken'})
//     }
//     else{
//         //hash the password
//         let hashedPassword = await bcryptjs.hash(newUser.password, 6);

//         //Replace the plain password with hashedPassword
//         newUser.password = hashedPassword;
//         newUser.emailNotifications = true;

//         const newUserToInsert = new userModel(newUser);

//         let res = await newUserToInsert.save();

//         response.send({message:'success',user:res})
//     }

// }))

userApp.post('/login',expressAsynHandler(userLogin))
// userApp.post('/login',expressAsynHandler(async (request,response) => {
//     let userCred = request.body;
    

//     let isExists = await userModel.find({username:userCred.username});

//     if(isExists.length == 0){
//         response.send({message:'user not found'})
//     }
//     else{
//         let isMatch = await bcryptjs.compare(userCred.password, isExists[0].password);
        
//         if (isMatch == false) {
//             response.send({ message: "Incorrect Password" });
//         }
//         else {

//             //create json web token
//             let token = jwt.sign({ username: isExists.username }, process.env.SECRET_KEY, { expiresIn: '2d' });
            
//             response.cookie('jwt',token);
            
//             //send signed web token
//             response.send({ message: "login successful", payload: token, user: isExists });
//         }
//     }
// }))

userApp.post('/logout',expressAsynHandler(userLogout))
// userApp.post('/logout',expressAsynHandler(async (request,response) => {
//     let userObj = request.body;
//     response.cookie('jwt','',{maxAge:0});
//     response.send({message:'logout successful'});
// }));

userApp.get('/get-posts/:userId',authorize,expressAsynHandler(getUserPosts))
// userApp.get('/get-posts/:userId',authorize,expressAsynHandler(async(request,response) => {

//     let userId = request.params.userId;
//     let currUser = request.query.currUser;
//     // console.log(userId,currUser);
//     // let posts = await postModel.find({userId:userId});
//     let posts = await postModel.aggregate([
//         {
//             $match:{userId:new mongoose.Types.ObjectId(userId)}
//         },
//         {
//             $addFields:{
//                 upvoted:{
//                     $cond:{
//                         if:{$in:[currUser,"$upvotes"]},
//                         then:true,
//                         else:false
//                     }
//                 }
//             }
//         }
//     ])

//     let totalUpvotes = await postModel.aggregate([
//         {
//             $match:{userId:new mongoose.Types.ObjectId(userId)}
//         },
//         {
//             $group:{
//                 _id:null,
//                 totalUpvotes:{$sum:"$upvotesCount"}
//             }
//         }
//     ])
//     // console.log(posts,totalUpvotes);
//     response.send({message:'success',posts:posts,totalUpvotes:totalUpvotes[0].totalUpvotes});
// }));

userApp.get('/get-user/:username',authorize,expressAsynHandler(getUser));
// userApp.get('/get-user/:username',authorize,expressAsynHandler(async(request,response) => {
//     let username = request.params.username;
//     // console.log(username);
//     let user = await userModel.findOne({username:username},{notifications:0,password:0});
//     response.send({message:'success',user:user})
// }))

userApp.put('/toggle-notifications',authorize,expressAsynHandler(toggleNotifications));
// userApp.put('/toggle-notifications',authorize,expressAsynHandler(async(request,response) => {
//     let userId = request.body.userId;
//     let changeTo = request.body.changeTo;
//     console.log(userId,changeTo);
//     let res = await userModel.updateOne({_id:userId},{$set:{emailNotifications:changeTo}});
//     console.log(res);
//     if(res.modifiedCount == 1) response.send({message:'success'});
//     else response.send({message:'failure'});
// }))

userApp.put('/update-email',authorize,verifyPassword,expressAsynHandler(updateEmail));
// userApp.put('/update-email',authorize,verifyPassword,expressAsynHandler(async(request,response) => {
    
//     let newEmail = request.body.newEmail;
//     let userId = request.body.userId;
//     console.log(newEmail,userId);


//     let res = await userModel.updateOne({_id:userId},{$set:{email:newEmail}})
//     if(res.modifiedCount == 1) response.send({message:'success'})
//     else response.send({message:'failure'});

// }))

userApp.put('/update-password',authorize,verifyPassword,expressAsynHandler(updatePassword));
// userApp.put('/update-password',authorize,verifyPassword,expressAsynHandler(async(request,response) => {
    
//     let userId = request.body.userId;
//     let newpassword = request.body.newPassword;

//     let hashedPassword = await bcryptjs.hash(newpassword, 6);

//     let res = await userModel.updateOne({_id:userId},{$set:{password:hashedPassword}})
//     if(res.modifiedCount == 1) response.send({message:'success',newpassword:hashedPassword})
//     else response.send({message:'failure'});

// }))

userApp.put('/forgot-update',expressAsynHandler(forgotUpdate));
// userApp.put('/forgot-update',expressAsynHandler(async(request,response) => {
//     let username = request.body.username;
//     let newpassword = request.body.newpassword;
//     console.log(username,newpassword);
//     let hashedPassword = await bcryptjs.hash(newpassword, 6);

//     let res = await userModel.updateOne({username:username},{$set:{password:hashedPassword}})
//     console.log(res);
//     if(res.modifiedCount == 1) response.send({message:'success'})
//     else response.send({message:'failure'});
// }))

userApp.delete('/delete-account/:userId',authorize,expressAsynHandler(deleteAccount));
// userApp.delete('/delete-account/:userId',expressAsynHandler(async(request,response) => {
//     let userId = request.params.userId;
//     console.log(userId);
//     let res = await userModel.deleteOne({_id:userId});
//     console.log(res);
//     response.send({message:'success'});
// }))

userApp.post('/send-otp/:username',expressAsynHandler(sendOTP));
// userApp.post('/send-otp/:username',expressAsynHandler(async (request,response) => {
//     let username = request.params.username;
//     console.log(username);
//     let isExists = await userModel.find({username:username});
//     if(isExists.length == 0) response.send({message:"user not found"});
//     else{

//         console.log(isExists);
//         let otp = getRandomNumber();
//         console.log(typeof otp);
//         const mailOptions = {
//             from: 'vembadi.madhu@gmail.com',
//             to: isExists[0].email,
//             subject: 'Password change for Change Makers',
//             text: `Your OTP to reset password is ${otp}`
//         };

//         let hashedOTP = await bcryptjs.hash(String(otp),6);
        
//         transporter.sendMail(mailOptions, async (error, info) => {
//             if (error) {
//                 response.send({message:"error in sending mail. try again later"})
//             } else {
//                 response.send({message:"success",otp:hashedOTP});
//             }
//         });
//     }
// }))

userApp.post('/verify-otp',verifyPassword,expressAsynHandler(async (request,response) => {
    response.send('success');
}))

module.exports = userApp;
