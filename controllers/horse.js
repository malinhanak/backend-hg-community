const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Horse = require('../models/horse');

const createHorse = async (req, res, next) => {
  const { body } = req;
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
    name: body.name,
    slug: body.slug,
    facts: body.facts,
    skills: body.skills,
    breeding: body.breeding,
    offsprings: [],
    pedigree: body.pedigree,
    ownership: body.ownership,
    description: body.description,
    traits: body.traits,
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
