const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// router.get("/", adminController.adminController);
router.post("/", adminController.upload, adminController.csvUploadController);

module.exports = router;
