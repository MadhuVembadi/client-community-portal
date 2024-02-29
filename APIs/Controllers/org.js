const orgInteractor = require('../Interactors/org');


async function getStats(request,response) {
    let org = request.params.org;
    let user = request.query.user;
    console.log(org,user);
    let users = await orgInteractor.getUsers(org);
    let posts = await orgInteractor.getPosts({org:org,loggedinUser:user});
    response.send({message:'success',users:users,posts:posts});
}

module.exports = {
    getStats
}