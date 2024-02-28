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
const { postNotification, markAllRead, markRead, sendEmail } = require('../APIs/Interactors/notification');
require('dotenv').config();
const nodemailer = require('nodemailer')


let sandbox = sinon.createSandbox();

describe('notification',() => {

    let sampleNotification;
    let updateOneStub;
    let findOneStub;
    let stubTransporter;
    let sendEmailStub;
    
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

    describe('Mark a single post as read',() => {
        it('should should change the status of a post as read',(done) => {
            updateOneStub = sandbox.stub(mongoose.Model, 'updateOne').resolves({modifiedCount:1});

            markRead({notificationId:'65cc65a46e7e79d90003cbee',userId:"65cc65a46e7e79d90003cbee"})
            .then(res => {
                expect(res).to.have.property('message').to.equal('success')
                done();
            })
            .catch(err => {
                throw new Error(err);
            })
        })
    })

    describe('send email',() => {
        afterEach(() => {
            findOneStub.restore();
        })

        afterEach(() => {
            sinon.restore();
        })
        
        it('should not send an email if email notifications are turned off',(done) => {
            findOneStub = sinon.stub(mongoose.Model,'findOne').resolves({...sampleUser,emailNotifications:false});
            sendEmail({to:"testUsername",message:"this is an test email"})
            .then(res => {
                expect(res).to.have.property('message').to.equal('email notification turned off');
                done();
            })
            .catch(err => {
                console.log(err);
                throw new Error(err.message);
            })
        })

        it('should send an email if email notifications are turned on',(done) => {
            findOneStub = sinon.stub(mongoose.Model,'findOne').resolves(sampleUser);
            
            stubTransporter = {
                sendMail: sinon.stub().resolves({ messageId: '12345' }) // Stub sendMail function to resolve with a dummy message ID
            };

            sinon.stub(nodemailer, 'createTransport').returns(stubTransporter);
            

            sendEmail({to:"testUsername",message:"this is an test email"})
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
})