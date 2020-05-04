const expect = require('chai').expect;

const Horse = require('../models/horse');

process.env.NODE_ENV = 'Test';

describe('Horse model', function () {
  it('should be invalid if name is empty', function (done) {
    const horse = new Horse();

    horse.validate(function (err) {
      expect(err.errors.name).to.exist;
      expect(err.errors.slug).to.exist;
      expect(err.errors.description).to.exist;
      expect(err.errors.img).to.exist;
      done();
    });
  });
});