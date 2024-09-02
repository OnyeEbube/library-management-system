const mongoose = require("mongoose");

const BookSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Please enter book name"],
			set: (val) => val.toLowerCase(),
		},
		isbn: {
			type: String,
			required: false,
			default: "12367",
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
			set: (val) => val.toLowerCase(),
		},

		synopsis: {
			type: String,
			required: false,
			default: "",
			set: (val) => val.toLowerCase(),
		},

		quantity: {
			type: Number,
			required: true,
			default: 0,
		},

		status: {
			type: String,
			enum: ["available", "unavailable", "damaged"],
			default: "available",
			set: (val) => val.toLowerCase(),
		},

		image: {
			type: String,
			required: false,
			default: "",
		},

		category: {
			type: String,
			enum: [
				"romance",
				"historical fiction",
				"sci-fi",
				"engineering",
				"comedy",
				"autobiography",
				"thriller",
				"fiction",
			],
			set: (val) => val.toLowerCase(),
		},
		availability: {
			type: String,
			enum: ["hard copy", "ebook"],
			default: "hard copy",
			set: (val) => val.toLowerCase(),
		},
		borrowedBy: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		borrowCount: { type: Number, default: 0 },
		returnDate: { type: Date, default: null },
	},
	{
		timestamps: true,
	}
);
BookSchema.index({ title: "text", author: "text", synopsis: "text" });

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
