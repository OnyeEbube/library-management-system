const mongoose = require("mongoose");

const BookSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Please enter book name"],
		},
		isbn: {
			type: String,
			required: false,
			default: "",
		},
		pages: {
			type: Number,
			required: false,
			default: 0,
		},
		year: {
			type: Number,
			required: false,
			default: 0,
		},
		author: {
			type: String,
			required: [true, "Please enter author's name"],
			default: "",
		},

		synopsis: {
			type: String,
			required: false,
			default: "",
		},

		quantity: {
			type: Number,
			required: true,
			default: 0,
		},

		status: {
			type: String,
			enum: ["Available", "Unavailable", "Damaged"],
			default: "Available",
		},

		image: {
			type: String,
			required: false,
			default: "",
		},

		category: {
			type: String,
			enum: ["Romance", "Fiction", "African Fiction", "Horror", "Non-fiction"],
		},
		availability: {
			type: String,
			enum: ["Hard copy", "eBook"],
			default: "Hard copy",
		},
		borrowedBy: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		returns: [
			{
				returnedAt: { type: Date },
			},
		],
	},
	{
		timestamps: true,
	}
);
BookSchema.index({ title: "text", author: "text", synopsis: "text" });

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
