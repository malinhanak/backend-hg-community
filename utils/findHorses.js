const Horse = require('../models/horse');

exports.findHorses = async (key, property, select = null) => {
  return await Horse.find({ [key]: property }, select);
};
