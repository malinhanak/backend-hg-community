const { check } = require('express-validator');

module.exports = [
  check('email').normalizeEmail().isEmail(),
  check('password').isLength({ min: 6 }),
  check('characterName').not().isEmpty(),
  check('level').not().isEmpty(),
];
