const express = require("express");
const router = new express.Router();

const AvailablePoliciesModel = require("../models/AvailablePoliciesModel");
const availablePoliciesControllers = require("../controllers/availablePoliciesControllers");

router.route("/").get(availablePoliciesControllers.getAllPolicies);

router.route("/:policyId").get(availablePoliciesControllers.getSinglePolicy);

module.exports = router;
