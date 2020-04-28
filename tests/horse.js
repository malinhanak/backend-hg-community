const request = require('supertest');
const mongoose = require('mongoose');
const { mockRequest, mockResponse } = require('../utils/interceptor');
const horseController = require('../controllers/horse');
const Horse = require('../models/horse');

describe('Check methods for horse controller', () => {
  beforeEach((done) => {
    mongoose.connect(
      `mongodb://localhost/testMessages`,
      { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
      () => {
        mongoose.connection.db.dropDatabase(() => {
          done();
        });
      },
    );
  });

  test('should 200 and return correct value', async () => {
    let req = mockRequest();
    req.body = {
      name: 'Svarta Faran',
      slug: 'svarta-faran',
      facts: {
        born: 2013,
        height: 145,
        breed: 'Tysk Ridponny',
        type: 'Pony',
        cat: 'D',
      },
      skills: [{ discipline: 'Hoppning', level: '1' }],
      breeding: {
        status: false,
        inheritanceScore: 3,
      },
      pedigree: {
        sire: 'Royal Black',
        sireLink: null,
        dam: 'Little Miss Danger',
        damLink: null,
      },
      ownership: {
        owner: {
          id: '5ea1a0c7d0525457e87e9522',
          name: 'HG Admin',
        },
      },
      description:
        'Allt om svarten är en lögn... haha, <strong>fet</strong>, <em>italic</em></ br>Line break!',
      traits: ['Snabb', 'Busig', 'Svårriden'],
      img: 'https://i.ibb.co/qktDQvk/dapplegrey.png',
    };
    const res = mockResponse();
    const { body } = req;
    const createdHorse = new Horse({
      name: body.name,
      slug: body.slug,
      facts: body.facts,
      skills: body.skills,
      breeding: body.breeding,
      offsprings: [],
      pedigree: body.pedigree,
      ownership: body.ownership,
      description: body.description,
      traits: body.traits,
      img: 'https://i.ibb.co/qktDQvk/dapplegrey.png',
    });

    await horseController.createHorse(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ horse: createdHorse });
  });
});
