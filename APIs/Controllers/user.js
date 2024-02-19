const userInteractor = require('../Interactors/user');

async function userSignup(request,response) {

    let newUser = request.body;
    let res;
    try{
        res = await userInteractor.registerUser(newUser);
        response.send({message:'success',user:res});
    }
    catch(err){
        response.send({message:err.message});
    }
    
}

async function userLogin(request,response) {
    let userCred = request.body;
    try{
        let res = await userInteractor.loginUser(userCred);
        response.cookie('jwt',res.payload,{maxAge:1000 * 60 * 60 * 24 * 10});
        // console.log(res);
        response.send(res);
    }
    catch(err){
        response.send({message:err.message});
    }
}

async function userLogout(request,response) {
    let userObj = request.body;
    response.cookie('jwt','',{maxAge:0});
    response.send({message:'logout successful'});
}

async function getUserPosts(request,response) {

    let userId = request.params.userId;
    let currUser = request.query.currUser;
    try{
        let res = await userInteractor.getPostsUser({userId,currUser});
        response.send(res);
    }
    catch(err){
        response.send({message:err.message})
    }
}

async function getUser(request,response) {
    let username = request.params.username;
    let res = await userInteractor.getUser(username);
    response.send(res);
}

async function toggleNotifications(request,response) {
    let userId = request.body.userId;
    let changeTo = request.body.changeTo;
    let res = await userInteractor.toggleNotifications({userId,changeTo});
    response.send(res);
}

async function updateEmail(request,response) {
    let newEmail = request.body.newEmail;
    let userId = request.body.userId;
    let res = await userInteractor.updateEmail({newEmail,userId});
    response.send(res);
}
async function updatePassword (request,response) {
    
    let userId = request.body.userId;
    let newpassword = request.body.newPassword;

    let res = await userInteractor.updatePassword({userId,newpassword});
    response.send(res);
}

async function forgotUpdate (request,response) {

    let username = request.body.username;
    let newpassword = request.body.newpassword;

    let res = await userInteractor.forgotUpdate({username,newpassword});
    response.send(res);
}

async function deleteAccount(request,response) {
    
    let userId = request.params.userId;
    // console.log(userId);
    let res = await userInteractor.deleteAccount(userId);
    response.send(res);
}

async function sendOTP(request,response) {
    let username = request.params.username;
    // console.log(username);
    let res = await userInteractor.sendOTP(username);
    response.send(res);
}

module.exports = {
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
}
