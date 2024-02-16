const userModel = require('../models/userModel');
const expect = require('chai').expect;
const sinon = require('sinon')
const mongoose = require('mongoose');
const ValidationError = mongoose.Error.ValidationError;

describe('Testing user model',() => {

    let sampleUserVal;
    let userModelStub;

    beforeEach(() => {
        sampleUserVal = {
            firstname:"Stephen",
            lastname:"Curry",
            email:"steph@gmail.com",
            organisation:"darwinbox",
            countrycode:"+91",
            phone:"9108273465",
            notifications:[],
            username:"steph.curry",
            password:"sdfdsfdsf"

        }
        userModelStub = sinon.stub(userModel.prototype, 'save');
    })

    afterEach(() => {
        userModelStub.restore();
    });

    it('should throw an error due to missing fields',(done) => {
        let user = new userModel();
        user.validate()
        .catch((err) => {
            expect(err).to.be.an.instanceOf(ValidationError);
            expect(err.errors.firstname).to.exist;
            expect(err.errors.lastname).to.exist;
            expect(err.errors.email).to.exist;
            expect(err.errors.organisation).to.exist;
            expect(err.errors.countrycode).to.exist;
            expect(err.errors.phone).to.exist;
            expect(err.errors.username).to.exist;
            expect(err.errors.password).to.exist;
            expect(err.errors.emailNotifications).to.exist;
            done();
        });
    });

    it('should throw an error when there is a type mismatch of any field',(done) => {
        let user = new userModel({
            ...sampleUserVal,
            emailNotifications:"sdfdsfs"
        })

        user.validate()
        .catch((err) => {
            expect(err).to.be.an.instanceOf(ValidationError);
            expect(err.errors.emailNotifications).to.exist;
            done();
        })
    })

    it('should create the user when all the fields are provided correctly',(done) => {
        userModelStub.resolves(sampleUserVal);

        let user = new userModel({
            ...sampleUserVal,
            emailNotifications:true
        })

        user.save()
            .then((savedUser) => {
                expect(savedUser).to.exist;
                expect(savedUser.firstname).to.equal(sampleUserVal.firstname);
                done();
            })
            .catch((err) => {
                done(err);
            });
    })
})