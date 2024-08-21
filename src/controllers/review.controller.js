const { ReviewService } = require("../services");

const ReviewController = {};

ReviewController.createReview = async (req, res) => {
	try {
		const { bookId } = req.params;
		const userId = req.user.id;
		if (!userId) {
			return res.status(401).json({ error: "Login to create a review" });
		}
		const reviewPayload = {
			...req.body,
			userId,
			bookId,
		};
		const newReview = await ReviewService.createReview(reviewPayload);
		res.status(201).json(newReview);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

ReviewController.findReview = async (req, res) => {
	try {
		const filter = req.query;
		const review = await ReviewService.findReview(filter);
		if (!review) {
			return res.status(404).json({ error: "Review not found" });
		}
		res.json(review);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

ReviewController.findReviews = async (req, res) => {
	try {
		const filter = req.query;
		const reviews = await ReviewService.findReviews(filter);
		if (!reviews) {
			return res.status(404).json({ error: "Reviews not found" });
		}
		res.json(reviews);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

ReviewController.updateReview = async (req, res) => {
	try {
		const { id } = req.params;
		const review = req.body;
		const updatedReview = await ReviewService.updateReview(id, review);
		if (!updatedReview) {
			return res.status(400).json("Review does not exist");
		}
		res.json(updatedReview);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

ReviewController.deleteReview = async (req, res) => {
	try {
		const { id } = req.params;
		const deletedReview = await ReviewService.deleteReview(id);
		if (!deletedReview) {
			return res.status(400).json("Review does not exist");
		}
		res
			.status(201)
			.json({ message: "Review deleted successfully", deletedReview });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = { ReviewController };
