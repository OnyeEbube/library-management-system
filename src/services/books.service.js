const Book = require("../models/books.model.js");
//const mongoose = require("mongoose");
//const ObjectId = mongoose.Types.ObjectId;

const BookService = {};

BookService.findOne = async (filter) => {
	return await Book.findOne(filter);
};

BookService.findTopBooks = async () => {
	return await Book.find().sort({ borrowCount: -1 });
};

BookService.countBooks = async (filter = {}) => {
	return await Book.countDocuments(filter);
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
					$subtract: ["$quantity", { $size: { $ifNull: ["$borrowedBy", []] } }],
				},
			},
		},
		{
			$group: {
				_id: null,
				totalAvailable: { $sum: "$availableQuantity" },
			},
		},
		{
			$project: {
				totalAvailable: 1,
				debugInfo: {
					totalBooks: { $sum: "$quantity" },
					totalBorrowedBy: { $sum: "$borrowedBySize" },
				},
			},
		},
	]);
};

BookService.getBooksReturnedStats = async (startDate, endDate) => {
	return await Book.aggregate([
		{
			$match: {
				returnedAt: {
					$gte: startDate,
					$lt: endDate,
				},
			},
		},
		{
			$group: {
				_id: { $dateToString: { format: "%Y-%m-%d", date: "$returnedAt" } },
				count: { $sum: 1 },
			},
		},
	]);
};

BookService.countBorrowedBooks = async () => {
	return await Book.aggregate([
		{
			$project: {
				borrowed: { $size: { $ifNull: ["$borrowedBy", []] } },
			},
		},
		{
			$group: {
				_id: null,
				totalBorrowed: { $sum: "$borrowed" },
			},
		},
		{
			$project: {
				totalBorrowed: 1,
				debugInfo: {
					totalBooks: { $sum: "$borrowed" },
				},
			},
		},
	]);
};

BookService.deleteBook = async (id) => {
	return await Book.findOneAndDelete({ _id: id });
};

module.exports = { BookService };
