const AvailablePoliciesModel = require("../models/AvailablePoliciesModel");

exports.getAllPolicies = async (req, res) => {
  try {
    const policies = await AvailablePoliciesModel.find();

    res.status(200).json({ policies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
