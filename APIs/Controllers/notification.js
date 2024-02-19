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

module.exports = {
    postNotification,
    markAllRead,
    sendEmail
}