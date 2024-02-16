const expect = require('chai').expect;
const postModel = require('../models/postModel');
const sinon = require('sinon')
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const ValidationError = mongoose.Error.ValidationError;

describe('Testing post model',() => {

    let samplePostVal;
    let postModelStub;

    beforeEach(() => {
        samplePostVal = {
            userId:new ObjectId('65cdde87f1febfc9d61f84e2'),
            post:"this is a post",
            comments:[],
            upvotes:["65cdde87f1febfc9d61f84e2"],
            upvotesCount:5,
            image:"image.com",
            datePosted:"12/4/23"

        }
        postModelStub = sinon.stub(postModel.prototype, 'save');
    })

    afterEach(() => {
        postModelStub.restore();
    });

    it('should throw an error due to missing fields',(done) => {
        let post = new postModel();
        post.validate()
        .catch((err) => {
            expect(err).to.be.an.instanceOf(ValidationError);
            expect(err.errors.userId).to.exist;
            expect(err.errors.post).to.exist;
            expect(err.errors.upvotesCount).to.exist;
            expect(err.errors.image).to.exist;
            expect(err.errors.datePosted).to.exist;
            done();
        });
    });

    it('should throw an error when there is a type mismatch of any field',(done) => {
        let post = new postModel({
            ...samplePostVal,
            userId:"sdfdsf"
        })

        post.validate()
        .catch((err) => {
            expect(err).to.be.an.instanceOf(ValidationError);
            expect(err.errors.userId).to.exist;
            done();
        })
    })

    it('should create the user when all the fields are provided correctly',(done) => {
        postModelStub.resolves(samplePostVal);

        let post = new postModel({
            ...samplePostVal,
        })

        post.save()
            .then((savedPost) => {
                expect(savedPost).to.exist;
                expect(savedPost.userId).to.equal(samplePostVal.userId);
                done();
            })
            .catch((err) => {
                done(err);
            });
    })
})