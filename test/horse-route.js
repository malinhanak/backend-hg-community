process.env.NODE_ENV = 'Test';
require('should');
const request = require('supertest');
const mongoose = require('mongoose');
const expect = require('chai').expect;

const app = require('../app');
const Horse = mongoose.model('Horse');
const agent = request.agent(app);
const horseReqBody = require('../utils/horseBodyTest');
const db = require('../db');
const { createSlug } = require('../utils/createSlug');

describe('Horse CRUD test', function () {
  it('should post a horse a return horse object', () => {
    const testData = { ...horseReqBody, name: 'Princess Hemlock', slug: createSlug('Princess Hemlock') };

    return agent
      .post('/api/horses/')
      .send(testData)
      .expect(201)
      .then((result) => {
        result.body.horse.should.have.property('_id');
        result.body.horse.should.have.property('name');
        result.body.horse.should.have.property('slug');
        result.body.horse.facts.should.have.property('born');
        result.body.horse.facts.should.have.property('height');
        result.body.horse.facts.should.have.property('breed');
        result.body.horse.facts.should.have.property('type');
        result.body.horse.breeding.should.have.property('status');
        result.body.horse.breeding.should.have.property('inheritanceScore');
        result.body.horse.pedigree.should.have.property('sire');
        result.body.horse.pedigree.should.have.property('dam');
        result.body.horse.ownership.owner.should.have.property('id');
        result.body.horse.should.have.property('description');
        result.body.horse.should.have.property('img');
      })
      .catch((err) => err);
  });

  it('should not post if name is missing in request body', function () {
    const testData = { ...horseReqBody };

    return agent
      .post('/api/horses')
      .send(testData)
      .expect(422)
      .then((result) => {
        result.status.should.equal(422);
        result.text.message.should.equal('Invalid inputs');
      })
      .catch((err) => err);
  });

  it('should get all horses', function () {
    return agent
      .get('/api/horses/')
      .expect(200)
      .then((result) => {
        expect(result.body).to.be.a('Object');
        expect(result.body.horses).to.be.a('Array');
        expect(result.body.horses[0]).to.have.property('name');
        done();
      })
      .catch((err) => err);
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
