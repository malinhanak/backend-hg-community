// process.env.NODE_ENV = 'test';
// const { expect } = require('chai');
// const request = require('supertest');
// const bodyParser = require('body-parser');
// const express = require('express');
// const app = express();

// app.use(express.urlencoded({ extended: false }));

// // const app = require('../../../app');
// const horsesRoutes = require('../../../routes/horses');
// const createHorseValidator = require('../../../validators/createHorse');
// const reqBody = require('../../../utils/horseBodyTest');
// const { createHorse } = require('../../../controllers/horse');
// const db = require('../../../db');

// describe('POST /horseController.createHorse', function () {
//   before(function (done) {
//     db.connect()
//       .then(done)
//       .catch(function (err) {
//         done(err);
//       });
//   });

//   after(function (done) {
//     db.close()
//       .then(done)
//       .catch(function (err) {
//         done(err);
//       });
//   });

//   it('OK, creating a new horse', function (done) {
//     // app.use(bodyParser.json());
//     // app.use('/api/horses', horsesRoutes);
//     request(app)
//       .post('/', createHorse)
//       .send({ name: 'name tha horse', slug: 'slug' })
//       .then(function (res) {
//         console.log('RES', res);
//         const body = res.body;
//         expect(body).to.contain.property('name');
//         expect(body).to.contain.property('slug');
//         // expect(body).to.contain.property('_id');
//         // expect(body).to.contain.property('facts').that.deep.equals({});
//         // expect(body).to.contain.property('skills').that.deep.equals([]);
//         // expect(body).to.contain.property('breeding').that.deep.equals({});
//         // expect(body).to.contain.property('pedigree').that.deep.equals({});
//         // expect(body).to.contain.property('ownership').that.deep.equals({});
//         // expect(body).to.contain.property('description');
//         // expect(body).to.contain.property('traits').that.deep.equals([]);
//         // expect(body).to.contain.property('img');
//         done();
//       })
//       .catch(function (err) {
//         done(err);
//       });
//   });
// });
