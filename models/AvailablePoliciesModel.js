const mongoose = require('mongoose');

const availablePolicySchema = new mongoose.Schema({
  policy_number: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  coverage_type: {
    type: String,
    required: true,
  },
  deductible: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  premium: {
    type: Number,
    required: true,
  },
  information: {
    type: String,
    required: true,
  },
  benefits: {
    type: [String],
    required: true,
  },
});

const AvailablePolicy = mongoose.model('AvailablePolicy', availablePolicySchema);

module.exports = AvailablePolicy;
