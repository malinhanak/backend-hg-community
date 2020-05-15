const { check } = require('express-validator');

module.exports = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('facts.born').not().isEmpty(),
  check('facts.height').not().isEmpty(),
  check('facts.breed').not().isEmpty(),
  check('facts.type').not().isEmpty(),
  check('breeding.status').not().isEmpty(),
  check('breeding.inheritanceScore').not().isEmpty(),
  check('pedigree.sire').not().isEmpty(),
  check('pedigree.dam').not().isEmpty(),
  check('ownership.owner').not().isEmpty(),
  check('description').not().isEmpty(),
];
