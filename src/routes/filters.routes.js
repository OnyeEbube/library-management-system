const express = require("express");
const router = express.Router(); //;
const { FilterController } = require("../controllers/filters.controller");
const {
	adminAuth,
	userAuth,
	verifyUser,
	blockUser,
} = require("../middleware/jwt.middleware.js");

router.get("/", userAuth, FilterController.getFilteredData);

module.exports = router;
