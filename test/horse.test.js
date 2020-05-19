process.env.NODE_ENV = 'Test';
const util = require('util');
const request = require('supertest');
const mongoose = require('mongoose');
const expect = require('chai').expect;

const app = require('../app');
const Horse = mongoose.model('Horse');
const horseTestData = require('../assets/horseTestData');
const db = require('../db');
const { createSlug } = require('../utils/createSlug');

describe('Horse CRUD', function () {
  before(async () => {
    await db.connect();
  });

  it('should successfully create a new horse', async () => {
    // Arrange
    const testData = {
      ...horseTestData,
      name: 'Flying Dreams W',
      slug: createSlug('Flying Dreams W'),
      _id: '5ec2645a4716af3d3cabc383',
    };

    // Act
    const res = await request(app).post('/api/horses/').send(testData).expect(201);

    // Assert
    expect(res.body.message).to.equal('Flying Dreams W skapades utan problem');
    expect(res.statusCode).to.equal(201);
  });

  it('should not post if name is missing in request body', async () => {
    // Arrange
    const testData = { ...horseTestData };

    // Act
    const res = await request(app).post('/api/horses').send(testData).expect(422);

    // Assert
    expect(res.statusCode).to.equal(422);
    expect(res.body).to.have.property('error');
    expect(res.body).to.have.property('message').to.eql('Invalid inputs');
    expect(res.body.error[0]).to.have.property('msg').to.eql('Name is required');
  });

  it('should get a horse by slug', async () => {
    // Act
    const res = await request(app).get('/api/horses/flying-dreams-w').expect(200);

    // Assert
    expect(res.body).to.have.property('horse');
    expect(res.body.horse).to.be.a('object');
    expect(res.body.horse).to.have.property('name').to.equal('Flying Dreams W');
  });

  it('should get all horses', async () => {
    // Act
    const res = await request(app).get('/api/horses/').expect(200);

    // Assert
    expect(res.body).to.have.property('horses');
  });

  it('should edit a horse', async () => {
    const toUpdate = await request(app).get('/api/horses/flying-dreams-w').expect(200);

    expect(toUpdate.body.horse).to.have.property('name').to.equal('Flying Dreams W');

    const res = await request(app)
      .patch('/api/horses/flying-dreams-w')
      .send({ name: 'Dream O-Big', slug: createSlug('Dream O-Big') })
      .expect(200);

    expect(res.body.message).to.equal('Flying Dreams W har nu blivit uppdaterad');

    const oldHorseCheck = await request(app).get('/api/horses/flying-dreams-w').expect(404);

    expect(oldHorseCheck.body.message).to.equal('Could not find horse with slug flying-dreams-w');

    const updated = await request(app).get('/api/horses/dream-o-big').expect(200);

    expect(updated.body.horse).to.have.property('name').to.equal('Dream O-Big');
  });

  it('should delete a horse', async () => {
    const res = await request(app).delete('/api/horses/dream-o-big').expect(200);

    expect(res.body).to.have.property('message').to.equal('Dream O-Big är nu raderad.');
  });

  after(async () => {
    await Horse.deleteMany({});
    await db.close();
    await util.promisify((cb) => app.server.close(cb))();
  });
});
