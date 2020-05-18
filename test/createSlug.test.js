process.env.NODE_ENV = 'Test';

const expect = require('chai').expect;

const { createSlug } = require('../utils/createSlug');

describe('CREATE HORSE SLUG', function () {
  it('should not return the name unchanged', async () => {
    // Arrange
    const name = 'Flying Dreams W';

    // Act
    const result = await createSlug(name);

    // Assert
    expect(result).not.to.equal('Flying Dreams W');
  });

  it('should not return empty string', async () => {
    // Arrange
    const name = 'Flying Dreams W';

    // Act
    const result = await createSlug(name);

    // Assert
    expect(result).not.to.equal('');
  });

  it('should create a valid slug from name with the type of string', async () => {
    // Arrange
    const name = 'Flying Dreams W';

    // Act
    const result = await createSlug(name);

    // Assert
    expect(result).to.equal('flying-dreams-w');
    expect(result).to.be.a('string');
  });
});
