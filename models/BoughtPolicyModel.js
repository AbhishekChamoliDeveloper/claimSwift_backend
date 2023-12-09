const mongoose = require('mongoose');

const boughtPolicySchema = new mongoose.Schema({
  policyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AvailablePolicy',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  socialSecurityNumber: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  maritalStatus: {
    type: String,
    enum: ['single', 'married', 'divorced', 'widowed'],
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  annualIncome: {
    type: Number,
    required: true,
  },
  healthCondition: {
    type: String,
    required: true,
  },
  uploadedDocument: {
    type: String,
    required: true,
  },
});

const BoughtPolicy = mongoose.model('BoughtPolicy', boughtPolicySchema);

module.exports = BoughtPolicy;
