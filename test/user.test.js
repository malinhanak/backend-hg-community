process.env.NODE_ENV = 'Test';
const request = require('supertest');
const expect = require('chai').expect;

const app = require('../app');
const User = require('../models/user');
const userTestData = require('../assets/userTestData');
const db = require('../db');

describe('User CRUD', function () {
  before(async () => {
    await db.connect();
  });

  it('should successfully create a new user', async () => {
    // Arrange
    const url = '/api/users/signup';
    const expectedResponse = 'Användaren är nu skapad, och det går att logga in.';
    const testData = {
      ...userTestData,
      email: 'sara.levin@test.hg.se',
      _id: '5ec2645a4716af3d3cabc383',
    };

    // Act
    const res = await request(app).post(url).send(testData).expect(201);

    // Assert
    expect(res.body.message).to.equal(expectedResponse);
    expect(res.statusCode).to.equal(201);
  });

  after(async () => {
    await db.close();
  });
});
