const exp = require('express');
const notificationApp = exp.Router();
const userModel = require('../models/userModel');
const expressAsyncHandler = require('express-async-handler');
const { default: mongoose } = require('mongoose');
require('dotenv').config();


const { postNotification, markAllRead,sendEmail,markRead } = require('./Controllers/notification');

notificationApp.put('/',expressAsyncHandler(postNotification));
// notificationApp.put('/',expressAsyncHandler(async(request,response) => {
//     console.log(request.body);
//     let notifyObj = request.body;
//     let res = await userModel.updateOne(
//         {_id:notifyObj.to},
//         {
//             $push:{
//                 notifications:{
//                     type:notifyObj.type,
//                     from:notifyObj.from,
//                     postId:notifyObj.postId,
//                     message:notifyObj.message,
//                     status:notifyObj.status,
//                     date:notifyObj.date,
//                     fromUser:notifyObj.fromUser
//                 }
//             }
//         }
//     );
//     console.log(res);
//     response.send({message:'success'});
// }));

notificationApp.get('/:userId',expressAsyncHandler(async(request,response) => {
    let userId = request.params.userId;
    let filter = request.query.filter;
    console.log(filter);
    let res;
    if(filter != 'all'){
        let pipeline = [
            {
                $match:{_id:new mongoose.Types.ObjectId(userId)}
            },
            {
                $unwind:"$notifications"
            },
            {
                $match:{"notifications.type":String([filter])}
            },
            {
                $group:{
                    _id:new mongoose.Types.ObjectId(userId),
                    notifications:{$push:"$notifications"}

                }
            }
        ]
        res = await userModel.aggregate(pipeline);
        // console.log(res);
        response.send({message:'success',notifications:res.length > 0 ? res[0].notifications : [],present:res.length > 0});
    }
    else{
        res = await userModel.findOne({_id:[userId]})
        // console.log(res);
        response.send({message:'success',notifications:res.notifications,present:true})
    }
}))


notificationApp.put('/change-status/:userId',expressAsyncHandler(markAllRead));
// notificationApp.put('/change-status/:userId',expressAsyncHandler(async (request,response) => {
//     let obj = request.params.userId;
//     let res = await userModel.updateOne(
//         {
//             _id:new mongoose.Types.ObjectId(obj)
//         },
//         {
//             $set:{"notifications.$[].status":"read"}
//         }
//     );
//     console.log(res);
//     response.send({message:'success'});
// }))

notificationApp.post('/send-email',expressAsyncHandler(sendEmail)); 

notificationApp.put('/mark-read',expressAsyncHandler(markRead));

module.exports = notificationApp;