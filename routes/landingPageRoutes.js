const express = require("express");
const router = express.Router();
const landingPageController = require("../controllers/landingPageController");

router.get("/", landingPageController.landingPage);

router.get("/adminLogin", landingPageController.adminLogin);

router.post("/adminLogin", landingPageController.adminLoginTask);

module.exports = router;
