const expect = require('chai').expect;

const Horse = require('../models/horse');

process.env.NODE_ENV = 'Test';

describe('HORSE MODEL', function () {
  it('should be invalid if name is empty', function (done) {
    const data = {
      name: null,
      slug: null,
      facts: {
        born: null,
        height: null,
        breed: null,
        type: null,
        cat: null,
      },
      breeding: {
        status: null,
        inheritanceScore: null,
      },
      pedigree: {
        sire: null,
        dam: null,
      },
      ownership: {
        owner: {
          id: null,
          name: null,
        },
      },
      description: null,
      img: null,
    };
    const horse = new Horse(data);

    horse.validate(function (err) {
      // console.log('TEST ERROR MODEL', err.errors);
      expect(err.errors.name).not.to.exist;
      expect(err.errors.slug).to.exist;
      expect(err.errors.description).to.exist;
      expect(err.errors.img).to.exist;
      expect(err.errors.ownership.owner.id).to.exist;
      expect(err.errors.pedigree.dam).to.exist;
      expect(err.errors.pedigree.sire).to.exist;
      expect(err.errors.breeding.inheritanceScore).to.exist;
      expect(err.errors.breeding.status).to.exist;
      expect(err.errors.facts.type).to.exist;
      expect(err.errors.facts.breed).to.exist;
      expect(err.errors.facts.height).to.exist;
      expect(err.errors.facts.born).to.exist;
    });
    done();
  });
});
