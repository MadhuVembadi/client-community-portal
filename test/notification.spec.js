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
const { postNotification, markAllRead } = require('../APIs/Interactors/notification');
require('dotenv').config();


let sandbox = sinon.createSandbox();

describe('notification',() => {

    let sampleNotification;
    let updateOneStub;

    beforeEach(() => {
        sampleNotification = {  
            type:"like",
            from:"65cc65a46e7e79d90003cbee",
            postId:"65cc9daee39464d751aa6d43",
            message:"test message",
            status:"read",
            date:"14/2/2024",
            fromUser:"testUser"
        }
    })

    afterEach(() => {
        sandbox.restore();   
    })

    describe('post a notification',() => {

        it('should post a notification to the user',(done) => {
            updateOneStub = sandbox.stub(mongoose.Model, 'updateOne').resolves({modifiedCount:1});
            
            postNotification(sampleNotification)
            .then(res => {
                console.log(res);
                expect(res).to.have.property('message').to.equal('success');
                done();
            })
            .catch(err => {
                throw new Error(err);
            })
        })
    })
    
    describe('mark all as read',() => {
        it('should mark all notifications as read',(done) => {
            updateOneStub = sandbox.stub(mongoose.Model, 'updateOne').resolves({modifiedCount:1});

            markAllRead('65cc65a46e7e79d90003cbee')
            .then(res => {
                expect(res).to.have.property('message').to.equal('success')
                done();
            })
            .catch(err => {
                throw new Error(err);
            })
        })
    })
})