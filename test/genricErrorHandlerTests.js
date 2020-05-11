const expect = require('chai').expect;

const genricErrorHandler = require('../utils/genericErrorObj');

describe('GenericErrorObj ', () => {
  describe('Handler when called', () => {
    it('should return a object with message and error', () => {
      const result = genricErrorHandler('Något gick fel!', [
        { msg: 'some error', params: 'some param' },
      ]);

      expect(result).to.be.a('object');
      expect(result).to.have.property('message');
      expect(result).to.have.property('errors');
    });
  });
});
