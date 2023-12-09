const AvailablePoliciesModel = require("../models/AvailablePoliciesModel");

exports.getAllPolicies = async (req, res) => {
  try {
    const policies = await AvailablePoliciesModel.find();

    res.status(200).json({ policies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSinglePolicy = async (req, res) => {
  const { policyId } = req.params;

  try {
    const policy = await AvailablePoliciesModel.findById(policyId);

    if (!policy) {
      return res.status(404).json({ error: "Policy not found" });
    }

    res.status(200).json({ policy });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
