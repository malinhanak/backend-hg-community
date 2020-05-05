const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const SkillsSchema = new Schema({ discipline: String, level: String });

const HorseSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  facts: {
    born: { type: Number, required: true },
    height: { type: Number, required: true },
    breed: { type: String, required: true },
    type: { type: String, required: true },
    cat: { type: String },
  },
  skills: [SkillsSchema],
  breeding: {
    status: { type: Boolean, required: true },
    inheritanceScore: { type: Number, required: true },
  },
  offsprings: [{ type: mongoose.Types.ObjectId, ref: 'Horse' }],
  pedigree: {
    sire: { type: String, required: true },
    sireLink: { type: String },
    dam: { type: String, required: true },
    damLink: { type: String },
  },
  ownership: {
    owner: {
      id: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
      name: String,
    },
    renter: {
      id: { type: mongoose.Types.ObjectId, ref: 'User' },
      name: String,
    },
    caretaker: {
      id: { type: mongoose.Types.ObjectId, ref: 'User' },
      name: String,
    },
  },
  description: { type: String, required: true },
  traits: [String],
  img: { type: String, required: true },
});

HorseSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Horse', HorseSchema);
