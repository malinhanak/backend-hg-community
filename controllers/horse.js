const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Horse = require('../models/horse');

const createHorse = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('validation errors', errors);
    return next(
      new HttpError(
        'Kontrollera din data, fält saknas eller är felaktiga',
        422,
      ),
    );
  }

  const createdHorse = new Horse({
    name: req.body.name,
    slug: req.body.slug,
    facts: req.body.facts,
    skills: req.body.skills,
    breeding: req.body.breeding,
    offsprings: [],
    pedigree: req.body.pedigree,
    ownership: req.body.ownership,
    description: req.body.description,
    traits: req.body.traits,
    img: 'https://i.ibb.co/qktDQvk/dapplegrey.png',
  });

  try {
    await createdHorse.save();
  } catch (err) {
    const error = new HttpError(
      'Det gick inte att skapa hästen, vänligen försök igen',
      500,
    );
    return next(error);
  }

  res.status(201).json({ horse: createdHorse });
};

exports.createHorse = createHorse;
