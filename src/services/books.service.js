const Book = require("../models/books.model.js");
//const mongoose = require("mongoose");
//const ObjectId = mongoose.Types.ObjectId;

const BookService = {};

BookService.findOne = async (filter) => {
	return await Book.findOne(filter);
};

BookService.countBooks = async () => {
	return await Book.countDocuments();
};
BookService.findAll = async (limit, skip) => {
	return await Book.find().limit(limit).skip(skip);
};

BookService.uploadBookCover = async (id, image) => {
	return await Book.findByIdAndUpdate(id, { image }, { new: true });
};

BookService.findById = async (id) => {
	return await Book.findById(id);
};

BookService.createBook = async (data) => {
	return await Book.create(data);
};

BookService.updateBook = async (id, data) => {
	return await Book.findOneAndUpdate({ _id: id }, data, { new: true });
};

BookService.searchBook = async (query) => {
	return await Book.find({ $text: { $search: query } });
};

BookService.getAvailableBooks = async () => {
	return await Book.aggregate([
		{
			$project: {
				availableQuantity: {
					$subtract: ["$quantity", { $size: "$borrowedBy" }],
				},
			},
		},
		{
			$group: {
				_id: null,
				totalAvailable: { $sum: "$availableQuantity" },
			},
		},
	]);
};

BookService.countBorrowedBooks = async () => {
	return await Book.aggregate([
		{
			$project: {
				borrowed: { $size: "$borrowedBy" },
			},
		},
		{
			$group: {
				_id: null,
				totalBorrowed: { $sum: "$borrowed" },
			},
		},
	]);
};

BookService.deleteBook = async (id) => {
	return await Book.findOneAndDelete({ _id: id });
};

module.exports = { BookService };
