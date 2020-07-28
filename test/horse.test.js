process.env.NODE_ENV = 'Test';
const request = require('supertest');
const expect = require('chai').expect;

const app = require('../app');
const horseTestData = require('../assets/horseTestData');
const { createSlug } = require('../utils/createSlug');
const db = require('../db');

describe('Horse CONTROLLER', function () {
  before(async () => {
    await db.connect();
  });

  it('should successfully create a new horse', async () => {
    // Arrange
    const url = '/api/horse/';
    const expectedResponse = 'Flying Dreams W skapades utan problem';
    const testData = {
      ...horseTestData,
      name: 'Flying Dreams W',
      slug: createSlug('Flying Dreams W'),
    };

    // Act
    const res = await request(app).post(url).send(testData).expect(201);

    // Assert
    expect(res.body.message).to.equal(expectedResponse);
  });

  it('should get a horse by slug', async () => {
    // Arrange
    const url = '/api/horse/flying-dreams-w';
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

  it('should not post if name is missing in request body', async () => {
    // Arrange
    const testData = { ...horseTestData };
    const url = '/api/horse';
    const expectedResponse = {
      error: [{ location: 'body', msg: 'Name is required', param: 'name' }],
      message: 'Invalid inputs',
    };

    // Act
    const res = await request(app).post(url).send(testData).expect(422);

    // Assert
    expect(res.body).to.eql(expectedResponse);
  });

  it('should edit a horse', async () => {
    // Arrange
    const req = { body: { name: 'Dream O-Big' } };
    const url = '/api/horse/flying-dreams-w';
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
    const url = '/api/horse/flying-dreams-w';

    // Act
    const res = await request(app).get(url).expect(404);

    // Assert
    expect(res.body).to.have.property('message', expectedResponse);
  });

  it('should transfer a horse to new owner', async () => {
    // Arrange
    const req = { body: { id: '5f1eed9b2787253ae4e93f02', name: 'HG Moderator' } };
    const url = '/api/horse/transfer/dream-o-big';
    const expectedResponse = `Dream O-Big har nu blivit flyttad till ${req.body.name}`;

    // Act
    const res = await request(app).patch(url).send(req.body).expect(200);

    // Assert
    expect(res.body).to.have.property('message', expectedResponse);
  });

  it('should edit horse activity status', async () => {
    // Arrange
    const req = { body: { slug: 'dream-o-big' } };
    const expectedResponse = 'Dream O-Big är nu pensionerad.';
    const url = '/api/horse/retire';

    // Act
    const res = await request(app).patch(url).send(req.body);

    // Assert
    expect(res.body).to.have.property('message', expectedResponse);
  });

  it('should edit horse sale status', async () => {
    // Arrange
    const req = { body: { slug: 'dream-o-big' } };
    const expectedResponse = 'Dream O-Big är nu till salu';
    const url = '/api/horse/sale/status';

    // Act
    const res = await request(app).patch(url).send(req.body);

    // Assert
    expect(res.body).to.have.property('message', expectedResponse);
  });

  it('update a horse breeding status', async () => {
    // Arrange
    const req = { body: { slug: 'dream-o-big' } };
    const expectedResponse = 'Dream O-Big är nu aktiv inom avel.';
    const url = '/api/horse/breeding/status';

    // Act
    const res = await request(app).patch(url).send(req.body).expect(200);

    // Assert
    expect(res.body).to.have.property('message', expectedResponse);
  });

  it('should delete a horse', async () => {
    // Arrange
    const expectedResponse = 'Dream O-Big är nu raderad.';
    const url = '/api/horse/dream-o-big';

    // Act
    const res = await request(app).delete(url).expect(200);

    // Assert
    expect(res.body).to.have.property('message', expectedResponse);
  });

  after(async () => {
    await db.close();
  });
});
