process.env.NODE_ENV = 'Test';
const request = require('supertest');
const mongoose = require('mongoose');
const expect = require('chai').expect;

const app = require('../app');
const Horse = mongoose.model('Horse');
const horseTestData = require('../assets/horseTestData');
const { createSlug } = require('../utils/createSlug');
const db = require('../db');

describe('Horse CONTROLLER', function () {
  before(async () => {
    await db.connect();
    const newHorse = new Horse({
      ...horseTestData,
      name: 'Flying Cascade',
      slug: createSlug('Flying Cascade'),
    });

    const url = '/api/cms/horses/';
    await request(app).post(url).send(newHorse);
  });

  it('should get a horse by slug', async () => {
    // Arrange
    const url = '/api/horses/flying-cascade';
    const expectedResponse = 'Flying Cascade';

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

  after(async () => {
    await db.close();
  });
});
