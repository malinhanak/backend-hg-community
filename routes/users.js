const express = require('express');

const createUserValidator = require('../validators/createUser');
const userControllers = require('../controllers/user');

const router = express.Router();

router.post('/signup', createUserValidator, userControllers.createUser);

module.exports = router;
