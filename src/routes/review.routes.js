const express = require("express");
const { ReviewController } = require("../controllers/review.controller");
const { userAuth, verifyUser } = require("../middleware/jwt.middleware");
const router = express.Router();

router.post("/:bookId", userAuth, ReviewController.createReview);
router.get("/", ReviewController.findReviews);
router.get("/:id", ReviewController.findReview);
router.patch("/:id", userAuth, ReviewController.updateReview);
router.delete("/:id", userAuth, ReviewController.deleteReview);

const reviewRoute = router;
module.exports = reviewRoute;
