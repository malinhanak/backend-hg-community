process.env.NODE_ENV = 'Test';

const expect = require('chai').expect;
const sinon = require('sinon');

const Horse = require('../models/horse');
const horseController = require('../controllers/horse');
const horseDataBody = require('../utils/horseBodyTest');
const app = require('../app');
const db = require('../db');

describe('Horse Controller', function () {
  before(function (done) {
    db.connect()
      .then(() => {
        const horse = new Horse(horseDataBody);
        return horse.save();
      })
      .then(() => done());
  });

  it('should create a new horse', function (done) {
    horseDataBody.name = 'Test 2';
    horseDataBody.slug = 'test-2';

    const req = {
      body: horseDataBody,
    };

    const res = {
      statusCode: 500,
      status: function (code) {
        this.statusCode = code;
      },
      json: sinon.spy(),
    };

    horseController
      .createHorse(req, res, () => {})
      .then((createdHorse) => {
        // console.log('RESULT', createdHorse);
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
      },
      json: sinon.spy(),
    };

    horseController
      .getAllHorses({}, res, () => {})
      .then((result) => {
        // console.log('RESULT', result);
        expect(result).to.be.an('array');
        expect(result[0]).to.have.property('_id');
        expect(result[0]).to.have.property('name').that.is.a('string');
        expect(result[0]).to.have.property('slug').that.is.a('string');
        done();
      });
  });

  it('should return one requested horse, full document', function (done) {
    const req = {
      params: { slug: 'test-2' },
    };

    const res = {
      statusCode: 500,
      status: function (code) {
        this.statusCode = code;
      },
      json: sinon.spy(),
    };

    horseController
      .getHorseBySlug(req, res, () => {})
      .then((horse) => {
        expect(res.statusCode).to.equal(200);
        expect(horse).to.be.an('object');
        expect(horse).to.have.property('_id');
        expect(horse).to.have.property('name').that.is.a('string');
        expect(horse).to.have.property('slug', 'test-2').that.is.a('string');
        expect(horse)
          .to.have.property('ownership')
          .that.is.a('object')
          .that.has.property('owner');
        done();
      });
  });

  it('should return error if failed to find one horse', function (done) {
    const req = {
      params: { slug: 'miominmio' },
    };

    const res = {
      statusCode: 500,
      errors: null,
      status: function (code) {
        this.statusCode = code;
      },
      json: sinon.spy(),
    };

    horseController
      .getHorseBySlug(req, res, () => {})
      .then((horse) => {
        console.log('test horse', horse);
        expect(horse).to.be.undefined;
        expect(res.statusCode).to.equal(404);
        done();
      });
  });

  after(function (done) {
    Horse.deleteMany({}).then(() => {
      db.close()
        .then(() => {
          console.log('db disconnected');
          app.server.close(() => {
            console.log('server closed');
            process.exit(0);
          });
        })
        .then(() => done());
    });
  });
});
