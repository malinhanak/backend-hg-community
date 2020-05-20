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
    const expectedResponse = 'Flying Dreams W skapades utan problem';
    const testData = {
      ...horseTestData,
      name: 'Flying Dreams W',
      slug: createSlug('Flying Dreams W'),
      _id: '5ec2645a4716af3d3cabc383',
    };

    // Act
    const res = await request(app).post(url).send(testData).expect(201);

    // Assert
    expect(res.body.message).to.equal(expectedResponse);
    expect(res.statusCode).to.equal(201);
  });

  it('should not post if name is missing in request body', async () => {
    // Arrange
    const testData = { ...horseTestData };
    const url = '/api/horses';
    const expectedResponse = {
      error: [{ location: 'body', msg: 'Name is required', param: 'name' }],
      message: 'Invalid inputs',
    };

    // Act
    const res = await request(app).post(url).send(testData).expect(422);

    // Assert
    expect(res.body).to.eql(expectedResponse);
  });

  it('should get a horse by slug', async () => {
    // Arrange
    const url = '/api/horses/flying-dreams-w';
    const expectedResponse = 'Flying Dreams W';

    // Act
    const res = await request(app).get(url).expect(200);

    // Assert
    expect(res.body)
      .to.have.property('horse')
      .to.be.a('object')
      .to.have.property('name', expectedResponse);
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
    const expectedResponse = req.body['name']
      ? 'Dream O-Big [Prev. Flying Dreams W ] har nu blivit uppdaterad'
      : 'Flying Dreams W har nu blivit uppdaterad';

    // Act
    const res = await request(app).patch(url).send(req.body).expect(200);

    // Assert
    expect(res.body).to.have.property('message', expectedResponse);
  });

  it('should after a name update not find a horse with slug: flying-dreams-w', async () => {
    // Arrange
    const expectedResponse = 'Could not find horse with slug flying-dreams-w';
    const url = '/api/horses/flying-dreams-w';

    // Act
    const res = await request(app).get(url).expect(404);

    // Assert
    expect(res.body).to.have.property('message', expectedResponse);
  });

  it('should delete a horse', async () => {
    // Arrange
    const expectedResponse = 'Dream O-Big är nu raderad.';
    const url = '/api/horses/dream-o-big';

    // Act
    const res = await request(app).delete(url).expect(200);

    // Assert
    expect(res.body).to.have.property('message', expectedResponse);
  });

  after(async () => {
    await Horse.deleteMany({});
    await db.close();
    await util.promisify((cb) => app.server.close(cb))();
  });
});
