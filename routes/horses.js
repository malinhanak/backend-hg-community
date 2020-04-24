const express = require('express');

const createHorseValidator = require('../validators/createHorse');
const horseControllers = require('../controllers/horse');

const router = express.Router();

// router.get('/', (req, res, next) => {
//   console.log('GET request for horses-routes');
//   res.json({ message: 'It worked!' });
// });

router.post('/', createHorseValidator, horseControllers.createHorse);

// router.get('/:slug', (req, res, next) => {
//   console.log('GET request for horses-routes');
//   res.json({ message: 'It worked!' });
// });

// router.patch('/:hid', (req, res, next) => {
//   console.log('GET request for horses-routes');
//   res.json({ message: 'It worked!' });
// });

// router.delete('/:hid', (req, res, next) => {
//   console.log('GET request for horses-routes');
//   res.json({ message: 'It worked!' });
// });

// router.delete('/users/:uid', (req, res, next) => {
//   console.log('GET request for horses-routes');
//   res.json({ message: 'It worked!' });
// });

// router.delete('/results/:hid', (req, res, next) => {
//   console.log('GET request for horses-routes');
//   res.json({ message: 'It worked!' });
// });

module.exports = router;
