const express = require("express");
const router = new express.Router();

const adminController = require("../controllers/adminControllers")


router.route("/login").post(adminController.login);


module.exports = router