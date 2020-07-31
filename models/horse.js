const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const SkillsSchema = new Schema({
  level: Number,
  maxLevel: Number,
});

const HorseSchema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true },
  facts: {
    born: { type: Number, required: true },
    height: { type: Number, required: true },
    breed: { type: String, required: true },
    type: { type: String, required: true },
    cat: { type: String },
  },
  description: { type: String },
  traits: [String],
  img: { type: String },
  active: { type: Boolean, required: true },
  forSale: { type: Boolean },
  skills: {
    dressage: [Number],
    jumping: [Number],
    driving: [Number],
    eventing: [Number],
  },
  breeding: {
    status: { type: Boolean, required: true },
    inheritanceScore: { type: Number, required: true },
  },
  offsprings: [{ type: mongoose.Types.ObjectId, ref: 'Horse' }],
  pedigree: {
    sire: { type: String, required: true },
    sireSlug: { type: String },
    dam: { type: String, required: true },
    damSlug: { type: String },
  },
  ownership: {
    owner: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    renter: { type: mongoose.Types.ObjectId, ref: 'User' },
    caretaker: { type: mongoose.Types.ObjectId, ref: 'User' },
  },
});

HorseSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Horse', HorseSchema);
