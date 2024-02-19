const notificationInteractor = require('../Interactors/notification');


async function postNotification(request,response){

    let notifyObj = request.body;
    let res = await notificationInteractor.postNotification(notifyObj);
    response.send(res);
}

async function markAllRead(request,response){

    let obj = request.params.userId;
    let res = await notificationInteractor.markAllRead(obj);
    response.send(res);
}

async function sendEmail(request,response){
    let notifyObj = request.body;
    let res = await notificationInteractor.sendEmail(notifyObj);
    response.send(res);
}

async function markRead(request,response){
    let userId = request.body.userId;
    let notificationId = request.body.notificationId;
    let res = await notificationInteractor.markRead({userId,notificationId});
    response.send(res);
}

module.exports = {
    postNotification,
    markAllRead,
    sendEmail,
    markRead
}