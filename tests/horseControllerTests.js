const should = require('should');
const sinon = require('sinon');

const horseController = require('../controllers/horse');
const horseReqBody = require('../utils/horseBodyTest');

describe('Horse controller test: ', () => {
  describe('Create horse', () => {
    it('should create a new horse', () => {
      const Horse = function (horse) {
        this.save = () => {};
      };

      const req = horseReqBody;

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy(),
      };

      const controller = horseController(Horse);
      const createdHorse = controller.createHorse(req, res, () => {});

      // res.status.calledWith(201).should.equal(true);
      res.json.calledWith();
      // res.json.calledWith('Name is required').should.equal(true);
    });
  });
});
