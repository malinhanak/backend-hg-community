process.env.NODE_ENV = 'Test';
const request = require('supertest');
const mongoose = require('mongoose');
const expect = require('chai').expect;

const app = require('../app');
const Horse = mongoose.model('Horse');
const agent = request.agent(app);
const horseTestData = require('../assets/horseTestData');
const db = require('../db');
const { createSlug } = require('../utils/createSlug');

describe('Horse CRUD test', function () {
  before(function (done) {
    db.connect().then(() => {
      const testData = { ...horseTestData, name: 'Amelina W', slug: createSlug('Amelina W') };

      const horse = new Horse(testData);
      horse.save();
      done();
    });
  });

  it('should post a horse a return horse object', function () {
    const testData = { ...horseTestData, name: 'Flying Dreams W', slug: createSlug('Flying Dreams W') };

    return agent
      .post('/api/horses/')
      .send(testData)
      .expect(201)
      .then((result) => {
        expect(result.body.horse).to.be.a('object');
        expect(result.body.horse).to.have.property('_id');
      })
      .catch((err) => err);
  });

  it('should not post if name is missing in request body', function () {
    const testData = { ...horseTestData };

    return agent
      .post('/api/horses')
      .send(testData)
      .expect(422)
      .then((result) => {
        expect(result.statusCode).to.equal(422);
      })
      .catch((err) => err);
  });

  it('should get all horses', function () {
    return agent
      .get('/api/horses/')
      .expect(200)
      .then((result) => {
        expect(result.body.horses).to.be.a('Array');
        expect(result.body.horses[0]).to.have.property('name');
      })
      .catch((err) => err);
  });

  after(function (done) {
    console.log('closing horse-route');
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
