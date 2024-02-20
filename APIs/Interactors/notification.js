require('dotenv').config();
const userModel = require('../../models/userModel');
const postModel = require('../../models/postModel');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAILID,
      pass: process.env.MAILPASS
    }
  });

async function postNotification(notifyObj){

    // console.log(notifyObj);
    let res = await userModel.updateOne(
        {_id:notifyObj.to},
        {
            $push:{
                notifications:{
                    $each:[
                        {
                            type:notifyObj.type,
                            from:notifyObj.from,
                            postId:notifyObj.postId,
                            message:notifyObj.message,
                            status:notifyObj.status,
                            date:notifyObj.date,
                            fromUser:notifyObj.fromUser
                        }
                    ],
                    $position:0    
                }
            }
        }
    );
    console.log(res);
    return {message:'success'};
}

async function markAllRead(obj) {
    let res = await userModel.updateOne(
        {
            _id:new mongoose.Types.ObjectId(String(obj))
        },
        {
            $set:{"notifications.$[].status":"read"}
        }
    );
    // console.log(res);
    return {message:'success'};
}

async function sendEmail(notifyObj){
    // console.log(notifyObj);
    
    let toEmail = await userModel.findOne({_id:notifyObj.to},{email:1,emailNotifications:1});
    if(toEmail.emailNotifications == false) return {message:"email notification turned off"};
    // console.log(toEmail);
    const mailOptions = {
        from: process.env.MAILID,
        to: toEmail.email ,
        subject: 'New interactions to your post',
        text: notifyObj.message
    };
    try{
        let res = await transporter.sendMail(mailOptions);
        return {message:"success"}
    }
    catch(err){
        return {message:"error in sending notification."}
    }
}

async function markRead({userId,notificationId}){
    console.log("hi",notificationId,userId);
    // let res = await userModel.aggregate([
    //         {
    //             $match:{
    //                 _id:new mongoose.Types.ObjectId(String(userId))
    //             }
    //         },
    //         {
    //             $unwind:"$notifications"
    //         },
    //         {
    //             $match:{
    //                 "notifications._id":new mongoose.Types.ObjectId(String(notificationId))
    //             }
    //         },
    //         {
    //             $set:{
    //                 "notifications.status":"read"
    //             }
    //         }
    //     ]
    // )

    let res = await userModel.updateOne(
        {
            _id:new mongoose.Types.ObjectId(String(userId)),
            "notifications._id": new mongoose.Types.ObjectId(String(notificationId))
        },
        {  
            $set: { "notifications.$.status": "read" } 
        }
    )
    console.log("res",res);
    return {message:"success"};
}

module.exports = {
    postNotification,
    markAllRead,
    sendEmail,
    markRead
}