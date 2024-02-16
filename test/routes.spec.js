const chai = require('chai');
const expect = require('chai').expect;
const request = require('supertest');
const rewire = require('rewire');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const bcryptjs = require('bcryptjs');
const {ObjectId} = require('mongodb')
chai.use(sinonChai);
const userModel = require('../models/userModel');
require('dotenv').config();


const sandbox = sinon.createSandbox();

let app = require('../server');

describe('Testing express app routes', () => {

    let userObj = {};
    beforeEach(() => {
        userObj = {
            _id:new ObjectId('65cc65a46e7e79d90003cbee'),
            firstname:"Stephen",
            lastname:"Curry",
            email:"steph@gmail.com",
            organisation:"darwinbox",
            countrycode:"+91",
            phone:"9108273465",
            notifications:[],
            username:"steph.curry",
            password:"sdfdsfdsf",
            emailNotifications:true
        }

        
        sandbox.stub(userModel.prototype, 'save').resolves(userObj);
    })

    afterEach(() => {
        // app = rewire('../server');
        sandbox.restore();
    });

    describe('Testing userApp',() => {

        describe('testing /signup',() => {

            it('/signup should return username already present if registerd with same username',(done) => {
                request(app).post('/user/signup')
                .send({
                    ...userObj,
                    username:"madhu.vembadi"
                })
                .expect(200)
                .end((err,response) => {
                    expect(response.body).to.have.property('message').equal('username taken');
                    done();
                })
            })

            it('/signup should successfully create a user',(done) => {
                sandbox.stub(userModel, 'find').returns({
                    exec: sandbox.stub().resolves([userObj])
                });

                request(app).post('/user/signup')
                .send(userObj)
                .expect(200)
                .end((err,response) => {
                    expect(response.body).to.have.property('message').to.equal('success');
                    expect(response.body).to.have.property('user').to.have.property('username').to.equal(userObj.username);
                    done(err);
                })
            })
        })

        describe('tesing /login',() => {

            it('should return user not found when username is not registered',(done) => {
                
                request(app).post('/user/login')
                .send({
                    username:"sdfdsf",
                    password:"sdfdsfds"
                })
                .expect(200)
                .end((err,response) => {
                    expect(response.body).to.have.property('message').to.equal('user not found');
                    done();
                })
            })

            it('should return incorrect password when wrong password is entered',(done) => {
                request(app).post('/user/login')
                .send({
                    username:"madhu.vembadi",
                    password:"sdfdsfds"
                })
                .expect(200)
                .end((err,response) => {
                    expect(response.body).to.have.property('message').to.equal('Incorrect Password');
                    done();
                })
            })

            it('should return the user document when right credentials are entered',(done) => {
                
                // sandbox.stub(userModel, 'find').returns({
                //     exec: sandbox.stub().resolves([userObj])
                // });

                // const compareStub = sinon.stub(bcryptjs, 'compare').resolves(true);
                // console.log(compareStub);

                request(app).post('/user/login')
                .send({username:"madhu.vembadi", password:process.env.hashedPassword})
                .expect(200)
                .end((err,response) => {
                    console.log(response.body);
                    expect(response.body).to.have.property('message').to.equal('login successful');
                    expect(response.body).to.have.property('payload').to.exist; 
                    jwt = response.body.payload;
                    expect(response.body).to.have.property('user').to.be.an('array'); 
                    expect(response.body.user[0]).to.have.property('username').to.be.equal('madhu.vembadi')
                    done();
                }).timeout(5000)
            })
        })
        
        describe('testing /get-posts/:userId',() => {
            
        })
    })
})