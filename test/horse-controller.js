process.env.NODE_ENV = 'Test';

const expect = require('chai').expect;
const sinon = require('sinon');

const Horse = require('../models/horse');
const horseController = require('../controllers/horse-controller');
const horseTestData = require('../assets/horseTestData');
const app = require('../app');
const db = require('../db');
const { createSlug } = require('../utils/createSlug');

describe('Horse Controller', function () {
  before(function (done) {
    const testData = { ...horseTestData, name: 'Dreaming Big Q', slug: createSlug('Dreaming Big Q') };
    db.connect()
      .then(() => {
        const horse = new Horse(testData);
        return horse.save();
      })
      .then(() => done());
  });

  it('should create a new horse', function (done) {
    const testData = { ...horseTestData, name: 'Rocka Fellow Q', slug: createSlug('Rocka Fellow Q') };

    const req = {
      body: testData,
    };

    const res = {
      statusCode: 500,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: sinon.spy(),
    };

    horseController
      .create(req, res, () => {})
      .then((createdHorse) => {
        expect(res.statusCode).to.equal(201);
        expect(createdHorse).to.be.an('object');
        expect(createdHorse).to.have.property('name').that.is.a('string');
        expect(createdHorse).to.have.property('slug').that.is.a('string');
        expect(createdHorse).to.have.property('traits').that.is.a('array');
        expect(createdHorse)
          .to.have.property('ownership')
          .that.is.a('object')
          .that.has.property('owner')
          .that.has.property('name', 'HG Admin');
        done();
      })
      .catch((err) => console.log('ERROR: ', err));
  });

  it('should have return an array of all horses upon request, that only contains name, slug and id', function (done) {
    const res = {
      statusCode: 500,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: sinon.spy(),
    };

    horseController
      .getAll({}, res, () => {})
      .then((result) => {
        expect(result).to.be.an('array');
        expect(result[0]).to.have.property('_id');
        expect(result[0]).to.have.property('name').that.is.a('string');
        expect(result[0]).to.have.property('slug').that.is.a('string');
        done();
      });
  });

  it('should return one requested horse, full document', function (done) {
    const req = {
      params: { slug: 'dreaming-big-q' },
    };

    const res = {
      statusCode: 500,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: sinon.spy(),
    };

    horseController
      .getBySlug(req, res, () => {})
      .then((horse) => {
        expect(res.statusCode).to.equal(200);
        expect(horse).to.be.an('object');
        expect(horse).to.have.property('_id');
        expect(horse).to.have.property('name').that.is.a('string');
        expect(horse).to.have.property('slug', 'dreaming-big-q').that.is.a('string');
        expect(horse).to.have.property('ownership').that.is.a('object').that.has.property('owner');
        done();
      });
  });

  after(function (done) {
    console.log('closing horse-controller');
    Horse.deleteMany({}).then(() => {
      db.close().then(() => {
        console.log('db disconnected');
        app.server.close(() => {
          console.log('server closed');
          done();
        });
      });
    });
  });
});
