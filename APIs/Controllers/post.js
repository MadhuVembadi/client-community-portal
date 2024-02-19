const postInteractor = require('../Interactors/post');
const uploadImage = require('../Middlewares/s3upload').uploadImage;

async function getPost(request,response) {

    let postId = request.params.postId;
    let userId = request.query.user;
    let res = await postInteractor.getPost({postId,userId});
    response.send(res);
}

async function createPost(request,response) {

    let imgURL = "none";
    console.log(request.file);
    if(request.file != undefined){
        imgURL = await uploadImage({imageName:request.file.filename,imagePath:request.file.path})
        // console.log(imgURL);
    }
    let postObj = JSON.parse(request.body.post);
    let newPost = {...postObj,image:imgURL,datePosted:new Date()};
    // console.log(newPost);
    let res = await postInteractor.createPost(newPost);
    response.send(res);
}

async function getAllPosts(request,response){
    let loggedinUser = request.params.userId;
    let filter = request.query.filter;
    let res = await postInteractor.getAllPosts({loggedinUser,filter});
    response.send(res);
}


async function postLike(request,response){
    let obj = request.body;
    let res = await postInteractor.likePost(obj);
    response.send(res);
}

async function postDislike(request,response) {
    let obj = request.body;
    let res = await postInteractor.dislikePost(obj);
    response.send(res);
}

async function postComment(request,response) {
    let obj = request.body;
    // console.log(obj);
    let commentObj = {
        comment:obj.comment,
        userId:obj.userId,
        username:obj.username,
        datePosted:new Date()
    }
    let res = await postInteractor.commentPost(obj,commentObj);
    response.send(res);
}

module.exports = {
    getPost,
    createPost,
    getAllPosts,
    postLike,
    postDislike,
    postComment
}