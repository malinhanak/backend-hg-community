process.env.NODE_ENV = 'Test';

const expect = require('chai').expect;
const sinon = require('sinon');

const Horse = require('../models/horse');
const horseController = require('../controllers/horse');
const horseDataBody = require('../utils/horseBodyTest');
const app = require('../app');
const db = require('../db');
const { createSlug } = require('../utils/createSlug');

describe('Horse Controller', function () {
  before(function () {
    const testData = { ...horseDataBody };
    testData.name = 'Ymers Dream Q';
    testData.slug = createSlug(testData.name);
    db.connect().then(() => {
      const horse = new Horse(testData);
      return horse.save();
    });
  });

  it('should create a new horse', function () {
    const testData = { ...horseDataBody };
    testData.name = 'Haniball Lecter Q';
    testData.slug = createSlug(testData.name);

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

    return horseController
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
      })
      .catch((err) => console.log('ERROR: ', err));
  });

  it('should have return an array of all horses upon request, that only contains name, slug and id', function () {
    const res = {
      statusCode: 500,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: sinon.spy(),
    };

    return horseController
      .getAll({}, res, () => {})
      .then((result) => {
        expect(result).to.be.an('array');
        expect(result[0]).to.have.property('_id');
        expect(result[0]).to.have.property('name').that.is.a('string');
        expect(result[0]).to.have.property('slug').that.is.a('string');
      });
  });

  it('should return one requested horse, full document', function () {
    const req = {
      params: { slug: 'ymers-dream-q' },
    };

    const res = {
      statusCode: 500,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: sinon.spy(),
    };

    return horseController
      .getBySlug(req, res, () => {})
      .then((horse) => {
        expect(res.statusCode).to.equal(200);
        expect(horse).to.be.an('object');
        expect(horse).to.have.property('_id');
        expect(horse).to.have.property('name').that.is.a('string');
        expect(horse).to.have.property('slug', 'ymers-dream-q').that.is.a('string');
        expect(horse).to.have.property('ownership').that.is.a('object').that.has.property('owner');
      });
  });

  after(function () {
    Horse.deleteMany({}).then(() => {
      db.close().then(() => {
        console.log('db disconnected');
        app.server.close(() => {
          console.log('server closed');
        });
      });
    });
  });
});
