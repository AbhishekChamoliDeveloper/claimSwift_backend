const express = require("express");
const router = new express.Router();

const userController = require("../controllers/userControllers");
const authenticateUser = require("../middlewares/authenticateUser");

router.route("/").get(authenticateUser, userController.getUserInformation);

router.route("/signup").post(userController.signup);

router.route("/login").post(userController.login);

router.route("/settings").post(authenticateUser, userController.settings);

router
  .route("/buy-policy/:policyId")
  .post(authenticateUser, userController.buyPolicy);

router
  .route("/claim-policy/:policyId")
  .post(authenticateUser, userController.claimPolicy);

router
  .route("/bought-policies")
  .get(authenticateUser, userController.getBoughtPoliciesByUser);

router.post(
  "/mark-all-notifications-as-read",
  authenticateUser,
  userController.markAllNotificationsAsRead
);

module.exports = router;
