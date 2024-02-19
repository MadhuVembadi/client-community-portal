const chai = require('chai');
const expect = require('chai').expect;
const request = require('supertest');
const rewire = require('rewire');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')
const {ObjectId} = require('mongodb')
chai.use(sinonChai);
const mongoose = require('mongoose')
const userModel = require('../models/userModel');
const postModel = require('../models/postModel')
require('dotenv').config();

const {
    registerUser,
    loginUser,
    getPostsUser,
    getUser,
    toggleNotifications,
    updateEmail,
    updatePassword,
    deleteAccount,
    sendOTP
} = require('../APIs/Interactors/user')

const verifyPassword = require('../APIs/Middlewares/verifyPassword');

const sandbox = sinon.createSandbox();

// let app = require('../server');

// describe('Testing express app routes', () => {

//     let userObj = {};
//     beforeEach(() => {
//         userObj = {
//             _id:new ObjectId('65cc65a46e7e79d90003cbee'),
//             firstname:"Stephen",
//             lastname:"Curry",
//             email:"steph@gmail.com",
//             organisation:"darwinbox",
//             countrycode:"+91",
//             phone:"9108273465",
//             notifications:[],
//             username:"steph.curry",
//             password:"sdfdsfdsf",
//             emailNotifications:true
//         }

        
//         sandbox.stub(userModel.prototype, 'save').resolves(userObj);
//     })

//     afterEach(() => {
//         // app = rewire('../server');
//         sandbox.restore();
//     });

//     describe('Testing userApp',() => {

//         describe('testing /signup',() => {

//             it('/signup should return username already present if registerd with same username',(done) => {
//                 request(app).post('/user/signup')
//                 .send({
//                     ...userObj,
//                     username:"madhu.vembadi"
//                 })
//                 .expect(200)
//                 .end((err,response) => {
//                     expect(response.body).to.have.property('message').equal('username taken');
//                     done();
//                 })
//             })

//             it('/signup should successfully create a user',(done) => {
//                 sandbox.stub(userModel, 'find').returns({
//                     exec: sandbox.stub().resolves([userObj])
//                 });

//                 request(app).post('/user/signup')
//                 .send(userObj)
//                 .expect(200)
//                 .end((err,response) => {
//                     expect(response.body).to.have.property('message').to.equal('success');
//                     expect(response.body).to.have.property('user').to.have.property('username').to.equal(userObj.username);
//                     done(err);
//                 })
//             })
//         })

//         describe('tesing /login',() => {

//             it('should return user not found when username is not registered',(done) => {
                
//                 request(app).post('/user/login')
//                 .send({
//                     username:"sdfdsf",
//                     password:"sdfdsfds"
//                 })
//                 .expect(200)
//                 .end((err,response) => {
//                     expect(response.body).to.have.property('message').to.equal('user not found');
//                     done();
//                 })
//             })

//             it('should return incorrect password when wrong password is entered',(done) => {
//                 request(app).post('/user/login')
//                 .send({
//                     username:"madhu.vembadi",
//                     password:"sdfdsfds"
//                 })
//                 .expect(200)
//                 .end((err,response) => {
//                     expect(response.body).to.have.property('message').to.equal('Incorrect Password');
//                     done();
//                 })
//             })

//             it('should return the user document when right credentials are entered',(done) => {
                
//                 // sandbox.stub(userModel, 'find').returns({
//                 //     exec: sandbox.stub().resolves([userObj])
//                 // });

//                 // const compareStub = sinon.stub(bcryptjs, 'compare').resolves(true);
//                 // console.log(compareStub);

//                 request(app).post('/user/login')
//                 .send({username:"madhu.vembadi", password:process.env.hashedPassword})
//                 .expect(200)
//                 .end((err,response) => {
//                     console.log(response.body);
//                     expect(response.body).to.have.property('message').to.equal('login successful');
//                     expect(response.body).to.have.property('payload').to.exist; 
//                     jwt = response.body.payload;
//                     expect(response.body).to.have.property('user').to.be.an('array'); 
//                     expect(response.body.user[0]).to.have.property('username').to.be.equal('madhu.vembadi')
//                     done();
//                 }).timeout(5000)
//             })
//         })
        
//         describe('testing /get-posts/:userId',() => {
            
//         })
//     })
// })

describe('user interactor',() => {
    let sampleUser;
    let findStub;
    let findOneStub;
    let saveStub;
    let compareStub;
    let signStub;
    let updateOneStub;
    let aggregateStub;
    let deleteOneStub;
    let deleteManyStub;

    beforeEach(() => {
        sampleUser = {
            firstname:"testFirstName",
            lastname:"testLastName",
            email:"test@gmail.com",
            organisation:"testOrg",
            countrycode:"+91",
            phone:"9108273465",
            notifications:[],
            username:"testUsername",
            password:"testPassword",
            emailNotifications:true
        }

        saveStub = sandbox.stub(userModel.prototype, 'save');
        compareStub = sandbox.stub(bcryptjs,'compare');
        hashStub = sandbox.stub(bcryptjs, 'hash');
        signStub = sandbox.stub(jwt,'sign');
        
    })

    afterEach(() => {
        sandbox.restore();
    });

    describe('user signup',() => {

        it('should throw an error when username already taken', (done) => {
        
            findStub = sandbox.stub(mongoose.Model, 'find').resolves([sampleUser]);

            registerUser({username:"testUsername",password:"testPassword"})
            .then(res => {throw new Error("unexpected success")})
            .catch(err => {
                expect(err.message).to.equal('username taken');
                done();
            })
        })
        
        it('should create a user', (done) => {
            
            findStub = sandbox.stub(mongoose.Model, 'find').resolves([]);
            saveStub.resolves(sampleUser);

            registerUser(sampleUser)
            .then(res => {
                expect(res).to.have.property('username').to.equal('testUsername');
                done();
            })
            .catch(err => {
                throw new Error(err.message);
            })
        })
    })

    describe('user login',() => {

        it('should return user not found when username is not correct', (done) => {
            
            findStub = sandbox.stub(mongoose.Model, 'find').resolves([]);
            loginUser({username:"nousername",password:"testPassword"})
            .then(res => {
                throw new Error("unexpected success")
            })
            .catch(err => {
                expect(err.message).to.equal('user not found');
                done();
            })
        })

        it('should return incorrect password when given password is wrong', (done) => {

            findStub = sandbox.stub(mongoose.Model, 'find').resolves([sampleUser]);
            compareStub.resolves(false);
            
            loginUser({username:"testUsername",password:"testPassword"})
            .then(res => {
                throw new Error("unexpected success")
            })
            .catch(err => {
                expect(err.message).to.equal('Incorrect Password');
                done();
            })
        })

        it('should return the user when credentials are right', (done) => {
            findStub = sandbox.stub(mongoose.Model, 'find').resolves([sampleUser]);
            compareStub.resolves(true);
            signStub.resolves('jwt token')

            loginUser({username:"testUsername",password:""})
            .then(res => {
                expect(res).to.have.property('user').to.be.an('Array');
                expect(res.user[0]).to.have.property('username').to.be.equal('testUsername');
                expect(res.payload).to.equal('jwt token');
                done();
            })
            .catch(err => {
                throw new Error(err.message);
            })
        })
    })

    describe('get a user by username',() => {

        it('should return an object user',(done) => {

            findOneStub= sandbox.stub(mongoose.Model, 'findOne').onFirstCall().resolves({
                firstname:"testFirstName",
                lastname:"testLastName",
                email:"test@gmail.com",
                organisation:"testOrg",
                phone:"9108273465",
                username:"testUsername",
                emailNotifications:true
            });
            getUser({username:"testUsername"})
            .then(res => {
                expect(res.user).to.have.property('username').to.equal('testUsername');
                done();
            })
            .catch(err => {
                throw new Error(err);
            })
        })
    })

    describe('toggle notification status',() => {

        it('should change the status of emailNotifications field',(done) => {

            updateOneStub = sandbox.stub(mongoose.Model, 'updateOne').resolves({modifiedCount:1})

            toggleNotifications({userId:'65cc65a46e7e79d90003cbee',changeTo:false})
            .then(res => {
                expect(res).to.have.property('message').to.equal('success');
                done();
            })
            .catch(err => {
                console.log(err);
                throw new Error(err.message);
            })
        })
    })

    describe('get posts of a user by userId',() => {

        it('should return an array of posts posted by the user',(done) => {

            const samplePosts = [{
                _id: 'postId1',
                userId:"65cc65a46e7e79d90003cbee",
                post:"This is a post",
                comments:[],
                upvotes: ['user1', 'user2'],
                upvotesCount:2,
                image:"",
                datePosted:"18/02/24",
                upvoted:true
            }];
            const sampleTotalUpvotes = [{ _id: null, totalUpvotes: 10 }];

            aggregateStub = sandbox.stub(mongoose.Model, 'aggregate');
            aggregateStub.onFirstCall().resolves(samplePosts);
            aggregateStub.onSecondCall().resolves(sampleTotalUpvotes);

            getPostsUser({
                userId:'65cc65a46e7e79d90003cbee',
                currUser:'65cc65a46e7e79d90003cbee'
            })
            .then(res => {
                expect(res).to.have.property('message').to.equal('success');
                expect(res).to.have.property('posts').to.be.an('array');
                expect(res.posts[0]).to.have.property('userId').to.equal('65cc65a46e7e79d90003cbee');
                expect(res).to.have.property('totalUpvotes');
                done();
            })
            .catch(err => {
                throw new Error(err.message)
            })
        })
    })

    describe('update email', () => { 
        beforeEach(() => {
            updateOneStub = sinon.stub(mongoose.Model, 'updateOne')
        })
        afterEach(() => {
            updateOneStub.restore();
        })

        it('should update the email address if new email is not same as old one',(done) => {

            updateOneStub.resolves({matchedCount:1,modifiedCount:1})

            updateEmail({newEmail:'testemail@gmail.com',userId:'userId'})
            .then(res => {
                expect(res.message).to.equal('success');
                done();
            })
            .catch(err => {
                throw new Error();
            })
        })

        it('should not update the email address if new email is same as the old one',(done) => {
            
            updateOneStub.resolves({matchedCount:1,modifiedCount:0})
            
            updateEmail({newEmail:'testemail@gmail.com',userId:'userId'})
            .then(res => {
                expect(res.message).to.equal('new email address is same as old one');
                done();
            })
            .catch(err => {
                throw new Error();
            })
        })
    })

    describe('update password',() => {

        beforeEach(() => {

        })
        afterEach(() => {
            updateOneStub.restore();
        })

        it('should update the new password',(done) => {

            updateOneStub = sinon.stub(mongoose.Model, 'updateOne').resolves({modifiedCount:1});
            hashStub.resolves('testpassword')

            updatePassword({userId:"testuserid",newpassword:"testpassword"})
            .then(res => {
                expect(res).to.have.property('message').to.equal('success');
                expect(res).to.have.property('newpassword').to.equal('testpassword');
                done();
            })
            .catch(err => {
                throw new Error(err);
            })
            
        })
    })

    describe('update password on forgot',() => {

        it('should update the password to the newpassword',(done) => {

            updateOneStub = sinon.stub(mongoose.Model, 'updateOne').resolves({modifiedCount:1});
            hashStub.resolves('testpassword')

            updatePassword({username:"testusername",newpassword:"testpassword"})
            .then(res => {
                expect(res).to.have.property('message').to.equal('success');
                expect(res).to.have.property('newpassword').to.equal('testpassword');
                done();
            })
            .catch(err => {
                throw new Error(err);
            })
        })
    })

    describe('delete account',() => {

        // afterEach(() => {
        //     deleteOneStub.restore();
        //     deleteManyStub.resoter();
        // })

        it('should delete account of an user and all the posts of the user',(done) => {

            deleteOneStub = sinon.stub(mongoose.Model, 'deleteOne');
            deleteManyStub = sinon.stub(mongoose.Model, 'deleteMany');

            deleteOneStub.resolves({deletedCount:1});
            deleteManyStub.resolves({deletedCount:5});

            deleteAccount('testUserId')
            .then(res => { 
                expect(res).to.have.property('message').to.equal('success');
                done();
            })
            .catch(err => {
                throw new Error(err);
            })
        })
    })

    // describe('sent otp',() => {
    //     it('should send otp to the user email id',(done) => {
    //         findStub = sandbox.stub(mongoose.Model, 'find').resolves([sampleUser]);

    //         sendOTP('testUsername')
    //         .then(res => {
    //             expect(res).to.have.property('message').to.equal('success');
    //             done();
    //         })
    //         .catch(err => {
    //             throw new Error(err);
    //         })
    //     }).timeout(10000)
    // })

})

