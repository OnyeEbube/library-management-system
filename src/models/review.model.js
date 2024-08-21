const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
	bookId: {
		type: String,
		required: true,
	},
	userId: {
		type: String,
		required: true,
	},
	starRating: {
		type: Number,
		required: true,
		min: 1,
		max: 5,
	},
	reviewText: {
		type: String,
		required: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;
