const Review = require("../models/review.model");

const ReviewService = {};

ReviewService.createReview = async (review) => {
	return await Review.create(review);
};

ReviewService.findReview = async (filter) => {
	return await Review.findOne(filter);
};

ReviewService.findReviews = async (filter) => {
	return await Review.find(filter);
};

ReviewService.updateReview = async (id, review) => {
	return await Review.findByIdAndUpdate({ _id: id }, review, { new: true });
};

ReviewService.deleteReview = async (id) => {
	return await Review.findByIdAndDelete({ _id: id });
};

module.exports = { ReviewService };
