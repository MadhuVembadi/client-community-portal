const bcryptjs = require('bcryptjs')
const userModel = require('../../models/userModel');
const postModel = require('../../models/postModel');
const {default:mongoose} = require('mongoose')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

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

async function registerUser(newUser) {

    let alreadyExists = await userModel.find({
        username:newUser.username
    })
    
    if(alreadyExists.length > 0) {
        throw new Error('username taken')
    }
    else{
        //hash the password
        let hashedPassword = await bcryptjs.hash(newUser.password, 6);

        //Replace the plain password with hashedPassword
        newUser.password = hashedPassword;
        newUser.emailNotifications = true;

        const newUserToInsert = new userModel(newUser);

        let res = await newUserToInsert.save();

        return res;
    }

}

async function loginUser(userCred){

    let isExists = await userModel.find({username:userCred.username});

    if(isExists.length == 0){
        throw new Error('user not found')
    }
    else{
        let isMatch = await bcryptjs.compare(userCred.password, isExists[0].password);
        
        if (isMatch == false) {
            throw new Error("Incorrect Password")
        }
        else {

            //create json web token
            let token = await jwt.sign({ username: isExists.username }, process.env.SECRET_KEY, { expiresIn: '2d' });
            
            //send signed web token
            return { message: "login successful", payload: token, user: isExists };
        }
    }
}

async function getPostsUser({userId,currUser}){
    let posts = await postModel.aggregate([
        {
            $match:{userId:new mongoose.Types.ObjectId(String(userId))}
        },
        {
            $addFields:{
                upvoted:{
                    $cond:{
                        if:{$in:[currUser,"$upvotes"]},
                        then:true,
                        else:false
                    }
                }
            }
        }
    ])

    let totalUpvotes = await postModel.aggregate([
        {
            $match:{userId:new mongoose.Types.ObjectId(String(userId))}
        },
        {
            $group:{
                _id:null,
                totalUpvotes:{$sum:"$upvotesCount"}
            }
        }
    ])

    return {message:'success',posts:posts,totalUpvotes:totalUpvotes[0].totalUpvotes}
}

async function getUser(username) {
    console.log(username);
    let user = await userModel.findOne({username:username},{notifications:0,password:0});
    console.log(user);
    return {message:'success',user:user}
}

async function toggleNotifications({userId,changeTo}){

    let res = await userModel.updateOne({_id:userId},{$set:{emailNotifications:changeTo}});
    if(res.modifiedCount == 1) return {message:'success'};
    else return {message:'failure'};
}

async function updateEmail({newEmail,userId}){

    let res = await userModel.updateOne({_id:userId},{$set:{email:newEmail}});

    if(res.modifiedCount == 1) return {message:'success'}
    else if(res.matchedCount == 1) return {message:'new email address is same as old one'}
    else return {message:'failure'};
}

async function updatePassword ({userId,newpassword}) {

    let hashedPassword = await bcryptjs.hash(newpassword, 6);

    let res = await userModel.updateOne({_id:userId},{$set:{password:hashedPassword}})
    if(res.modifiedCount == 1) return {message:'success',newpassword:hashedPassword}
    else return {message:'failure'}
}

async function forgotUpdate ({username,newpassword}) {

    let hashedPassword = await bcryptjs.hash(newpassword, 6);
    let res = await userModel.updateOne({username:username},{$set:{password:hashedPassword}})
    // console.log(res);
    if(res.modifiedCount == 1) return{message:'success'}
    else return{message:'failure'}
}

async function deleteAccount(userId){
    let res = await userModel.deleteOne({_id:userId});
    
    let res2 = await postModel.deleteMany({userId:userId});
    
    return {message:'success'};
}

async function sendOTP(username){
    let isExists = await userModel.find({username:username});
    if(isExists.length == 0) return {message:"user not found"}
    else{
        let otp = getRandomNumber();
        const mailOptions = {
            from: process.env.MAILID,
            to: isExists[0].email,
            subject: 'Password change for Change Makers',
            text: `Your OTP to reset password is ${otp}`
        };

        let hashedOTP = await bcryptjs.hash(String(otp),6);
        
        try{
            let res = await transporter.sendMail(mailOptions);
            return {message:"success",otp:hashedOTP}
        }
        catch(err){
            return {message:"error in sending mail. try again later"}
        }
    }
}

module.exports = {
    registerUser,
    loginUser,
    getPostsUser,
    getUser,
    toggleNotifications,
    updateEmail,
    updatePassword,
    forgotUpdate,
    deleteAccount,
    sendOTP
}