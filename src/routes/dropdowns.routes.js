const express = require("express");
const { DropdownController } = require("../controllers/dropdowns.controller");
const router = express.Router();

router.get("/activity-status", DropdownController.activityStatus);
router.get("/books-borrowed", DropdownController.booksBorrowed);
router.get("/name-sorting", DropdownController.nameSorting);
router.get("/authors", DropdownController.author);
router.get("/category", DropdownController.category);
router.get("/year", DropdownController.year);
router.get("/request-status", DropdownController.requestStatus);
router.get("/availability", DropdownController.availability);
router.get("/book-name", DropdownController.bookName);

module.exports = router;
