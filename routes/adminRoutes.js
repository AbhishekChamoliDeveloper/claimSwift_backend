const express = require("express");
const router = new express.Router();

const adminControllers = require("../controllers/adminControllers");
const authenticateAdmin = require("../middlewares/authenticateAdmin");

router.route("/login").post(adminControllers.login);

router
  .route("/approve-claim/:claimId")
  .patch(authenticateAdmin, adminControllers.approveClaim);

router
  .route("/reject-claim/:claimId")
  .patch(authenticateAdmin, adminControllers.rejectClaim);

router
  .route("/claim/:claimId")
  .get(authenticateAdmin, adminControllers.getClaim);

router
  .route("/pending-claims")
  .get(authenticateAdmin, adminControllers.getAllPendingClaims);

router.route("/users").get(authenticateAdmin, adminControllers.getAllUsers);

router
  .route("/claims/:status")
  .get(authenticateAdmin, adminControllers.getRejectedOrApprovedPolicy);

module.exports = router;
