const chai = require('chai');
const expect = require('chai').expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')
const {ObjectId} = require('mongodb')
chai.use(sinonChai);
const mongoose = require('mongoose')
const userModel = require('../models/userModel');
const postModel = require('../models/postModel');

require('dotenv').config();

const { getPost, createPost, getAllPosts, likePost, dislikePost, commentPost } = require('../APIs/Interactors/post');
const sandbox = sinon.createSandbox();

describe('Post Interactor',() => {

    let samplePost;
    let aggregateStub;
    let saveStub;
    let updateOneStub;

    beforeEach(() => {
        samplePost = {
            userId:new mongoose.Types.ObjectId('65cc65a46e7e79d90003cbee'),
            post:"this is a post",
            comments:[],
            upvotes:[],
            upvotesCount:5,
            image:"none",
            datePosted:new Date(),
        }

        aggregateStub = sandbox.stub(mongoose.Model, 'aggregate');
        saveStub = sandbox.stub(postModel.prototype, 'save');

    })
    afterEach(() => {
        sandbox.restore();
    })

    describe('get post by Id',() => {

        it('should return the post with the user who posted it',(done) => {

            aggregateStub.resolves([{
                ...samplePost,
                user:[
                    {
                        username:"testUsername",
                    }
                ],
                upvoted:true
            }]);

            getPost({postId:'65cc9daee39464d751aa6d43',userId:"testUserID"})
            .then(res => {
                expect(res).to.have.property('message').to.equal('success');
                expect(res).to.have.property('post').is.an('Object');
                expect(res.post).to.have.property('user').is.an('array');
                expect(res.post.user[0]).to.have.property('username').to.equal('testUsername');
                done();
            })
            .catch(err => {
                throw new Error(err);
            })
        })
    })

    describe('create a post',() => {

        it('should create a new post',(done) => {
            saveStub.resolves(samplePost);
            createPost(samplePost)
            .then(res => {
                expect(res).to.have.property('message').to.equal('success');
                expect(res).to.have.property('post').is.an('object')
                done();
            })
            .catch(err => {
                throw new Error(err);
            })
        })

    })

    describe('get feed',() => {
        it('should get the feed based on filter',(done) => {

            aggregateStub.resolves([
                {
                    ...samplePost,
                    user:[
                        {
                            username:"testUsername",
                        }
                    ],
                    upvoted:true
                }
            ])
            getAllPosts({userId:"65cc65a46e7e79d90003cbee",filter:"datePosted"})
            .then(res => {
                expect(res).to.have.property('message').to.equal('success');
                expect(res).to.have.property('feed').to.be.an('array');
                expect(res.feed[0]).to.have.property('user').to.be.an('array');
                expect(res.feed[0].user[0]).to.have.property('username').to.equal('testUsername');
                done();
            })
            .catch(err => {
                throw new Error(err);
            })
        })
    })

    describe('upvote',() => {
     
        it('should upvote a post',(done) => {

            updateOneStub = sandbox.stub(mongoose.Model, 'updateOne').resolves({modifiedCount:1})

            likePost({postId:'65cc65a46e7e79d90003cbee',userId:'65cc65a46e7e79d90003cbee'})
            .then(res => {
                expect(res).to.have.property('message').to.equal('success');
                done();
            })
            .catch(err => {
                throw new Error(err);
            })
        })
    })

    describe('downvote',() => {
     
        it('should downvote a post',(done) => {

            updateOneStub = sandbox.stub(mongoose.Model, 'updateOne').resolves({modifiedCount:1})

            dislikePost({postId:'65cc65a46e7e79d90003cbee',userId:'65cc65a46e7e79d90003cbee'})
            .then(res => {
                expect(res).to.have.property('message').to.equal('success');
                done();
            })
            .catch(err => {
                throw new Error(err);
            })
        })
    })

    describe('comment',() => {
        it('should post a comment on a post',(done) => {
            updateOneStub = sandbox.stub(mongoose.Model, 'updateOne').resolves({modifiedCount:1})

            let commentObj = {
                comment:"this is a test comment",
                userId:'65cc65a46e7e79d90003cbee',
                username:"testusername",
            }
            let obj = {
                postId:'65cc65a46e7e79d90003cbee',
                userId:'65cc65a46e7e79d90003cbee'
            }
            commentPost(obj,commentObj)
            .then(res => {
                expect(res).to.have.property('message').to.equal('success');
                done();
            })
            .catch(err => {
                throw new Error(err);
            })
        })
    })
})