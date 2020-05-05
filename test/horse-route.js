require('should');
const request = require('supertest');
const mongoose = require('mongoose');
const expect = require('chai').expect;

process.env.NODE_ENV = 'Test';

const app = require('../app');
const Horse = mongoose.model('Horse');
const agent = request.agent(app);
const horseReqBody = require('../utils/horseBodyTest');
const db = require('../db');

describe('Horse CRUD test', function () {
  before(function (done) {
    db.connect()
      .then(() => {
        const horse = new Horse(horseDataBody);
        return horse.save();
      })
      .then(() => done());
  });

  it('should post a horse a return horse object', function (done) {
    const horsePost = horseReqBody;

    agent
      .post('/api/horses/')
      .send(horsePost)
      .expect(201)
      .end((err, result) => {
        if (err) return done(err);

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

        done();
      });
  });

  it('should not post if name is missing in request body', function (done) {
    const horsePost = horseReqBody;
    delete horsePost.name;

    agent
      .post('/api/horses')
      .send(horsePost)
      .expect(422)
      .end(function (err, result) {
        if (err) return done(err);

        result.status.should.equal(422);
        done();
      });
  });

  it('should get all horses', function (done) {
    agent
      .get('/api/horses/')
      .expect(200)
      .end((err, result) => {
        console.log('err', err);
        if (err) return done(err);

        expect(result.body).to.be.a('Object');
        expect(result.body.horses).to.be.a('Array');
        expect(result.body.horses[0]).to.have.property('name');
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
