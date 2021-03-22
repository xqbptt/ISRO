const express = require("express");
const router = express.Router();
const toolController = require("../controllers/toolController");

router.get("/:visualizerName", toolController.toolController);
router.get("/data/:energyName", toolController.jsonSendingController);

module.exports = router;
