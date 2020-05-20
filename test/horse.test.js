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
    const url = '/api/horses/';
    const expectedMessage = 'Flying Dreams W skapades utan problem';
    const testData = {
      ...horseTestData,
      name: 'Flying Dreams W',
      slug: createSlug('Flying Dreams W'),
      _id: '5ec2645a4716af3d3cabc383',
    };

    // Act
    const res = await request(app).post(url).send(testData).expect(201);

    // Assert
    expect(res.body.message).to.equal(expectedMessage);
    expect(res.statusCode).to.equal(201);
  });

  it('should not post if name is missing in request body', async () => {
    // Arrange
    const testData = { ...horseTestData };
    const url = '/api/horses';

    // Act
    const res = await request(app).post(url).send(testData).expect(422);

    // Assert
    expect(res.statusCode).to.equal(422);
    expect(res.body).to.have.property('error');
    expect(res.body).to.have.property('message').to.eql('Invalid inputs');
    expect(res.body.error[0]).to.have.property('msg').to.eql('Name is required');
  });

  it('should get a horse by slug', async () => {
    // Arrange
    const url = '/api/horses/flying-dreams-w';
    const expectedMessage = 'Flying Dreams W';

    // Act
    const res = await request(app).get(url).expect(200);

    // Assert
    expect(res.body).to.have.property('horse');
    expect(res.body.horse).to.be.a('object');
    expect(res.body.horse).to.have.property('name', expectedMessage);
  });

  it('should get all horses', async () => {
    // Arrange
    const url = '/api/horses/';

    // Act
    const res = await request(app).get(url).expect(200);

    // Assert
    expect(res.body).to.have.property('horses');
  });

  it('should edit a horse', async () => {
    // Arrange
    const req = { body: { name: 'Dream O-Big' } };
    const url = '/api/horses/flying-dreams-w';
    const expectedMessage = req.body['name']
      ? 'Dream O-Big [Prev. Flying Dreams W ] har nu blivit uppdaterad'
      : 'Flying Dreams W har nu blivit uppdaterad';

    // Act
    const res = await request(app).patch(url).send(req.body).expect(200);

    // Assert
    expect(res.body).to.have.property('message', expectedMessage);
  });

  it('should after a name update not find a horse with slug: flying-dreams-w', async () => {
    // Arrange
    const expectedMessage = 'Could not find horse with slug flying-dreams-w';
    const url = '/api/horses/flying-dreams-w';

    // Act
    const res = await request(app).get(url).expect(404);

    // Assert
    expect(res.body).to.have.property('message', expectedMessage);
  });

  it('should delete a horse', async () => {
    // Arrange
    const expectedMessage = 'Dream O-Big är nu raderad.';
    const url = '/api/horses/dream-o-big';

    // Act
    const res = await request(app).delete(url).expect(200);

    // Assert
    expect(res.body).to.have.property('message', expectedMessage);
  });

  after(async () => {
    await Horse.deleteMany({});
    await db.close();
    await util.promisify((cb) => app.server.close(cb))();
  });
});
