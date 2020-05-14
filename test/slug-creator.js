process.env.NODE_ENV = 'Test';

const expect = require('chai').expect;

const { createSlug } = require('../utils/createSlug');

describe('CREATE HORSE SLUG', function () {
  it('should not return the name unchanged', function (done) {
    // Arrange
    const name = 'Flying Dreams W';

    // Act
    const result = createSlug(name);

    // Assert
    expect(result).not.to.equal('Flying Dreams W');
    done();
  });

  it('should not return empty string', function (done) {
    // Arrange
    const name = 'Flying Dreams W';

    // Act
    const result = createSlug(name);

    // Assert
    expect(result).not.to.equal('');
    done();
  });

  it('should create a valid slug from name with the type of string', function (done) {
    // Arrange
    const name = 'Flying Dreams W';

    // Act
    const result = createSlug(name);

    // Assert
    expect(result).to.equal('flying-dreams-w');
    expect(result).to.be.a('string');
    done();
  });
});
