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
		},
		pages: {
			type: Number,
			required: false,
		},
		year: {
			type: Number,
			required: false,
		},
		author: {
			type: String,
			required: [true, "Please enter author's name"],
		},

		synopsis: {
			type: String,
			required: false,
		},

		quantity: {
			type: Number,
			required: true,
			default: 0,
		},

		status: {
			type: String,
			enum: ["Available", "Unavailable"],
			default: "Available",
		},

		/*price: {
			type: Number,
			required: true,
			default: 0,
		},
		*/

		image: {
			type: String,
			required: false,
		},

		category: {
			type: String,
			enum: ["Romance", "Fiction", "African Fiction", "Horror", "Non-fiction"],
		},
		availability: {
			type: String,
			enum: ["Hard copy", "eBook"],
		},
		borrowedBy: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
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
