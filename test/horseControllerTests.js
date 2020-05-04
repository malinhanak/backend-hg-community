const should = require('should');
const sinon = require('sinon');
const expect = require('chai').expect;

const horseController = require('../controllers/horse');
const horseReqBody = require('../utils/horseBodyTest');

describe('Horse controller test: ', () => {
  describe('Create horse', () => {
    it('should create a new horse', async () => {
      const Horse = function (horse) {
        this.save = () => {};
      };

      const req = {body: horseReqBody};

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy(),
      };

      const controller = horseController(Horse);
      await controller.createHorse(req, res, () => {});

      expect(res.status.args[ 0 ][ 0 ]).equal(201);
      expect(res.json.calledOnce).to.equal(true);
    });
  });
});
