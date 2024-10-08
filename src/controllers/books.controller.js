const Book = require("../models/books.model.js");
const { BookService } = require("../services/books.service.js");
const upload = require("../config/multer.js");
const cloudinary = require("cloudinary").v2;
//const path = require("path");
const BookController = {};

BookController.getBooks = async (req, res) => {
	try {
		const limit = parseInt(req.query.limit) || 5;
		const page = parseInt(req.query.page) || 1;
		const skip = (page - 1) * limit;
		const filter = null;
		const books = await BookService.findAll(filter, limit, skip);
		const totalBooks = await BookService.countBooks(); // count total books
		const totalPages = Math.ceil(totalBooks / limit); // calculate total pages
		if (!books) {
			res.status(404).json({ error: "No books have been added" });
		}
		res.status(200).json({
			books,
			pagination: {
				totalBooks,
				totalPages,
				currentPage: page,
				limit,
			},
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

BookController.getBook = async (req, res) => {
	try {
		const { id } = req.params;
		const book = await BookService.findById(id);
		if (!book) {
			return res.status(400).json({ error: "Book does not exist" });
		}
		res.status(200).json(book);
	} catch (error) {
		res.status(500).json(error);
	}
};

BookController.createBook = async (req, res) => {
	try {
		const { title } = req.body;

		const existingBook = await BookService.findOne({ title: title });
		if (existingBook) {
			return res.status(400).json({ error: "Book already exists" });
		}
		const book = await BookService.createBook(req.body);
		res.status(200).json(book);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

BookController.uploadBookCover = async (req, res) => {
	try {
		const { id } = req.params;
		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}

		// Upload to Cloudinary
		const result = await cloudinary.uploader.upload(req.file.path, {
			folder: "book_cover_images",
		});

		// Save the URL to the user's profile
		const book = await BookService.findById(id); // Assume you have user ID in req.user.id
		book.image = result.secure_url;
		await book.save();

		res.status(200).json({
			message: "Book cover uploaded successfully",
			url: result.secure_url,
		});
	} catch (error) {
		res.status(500).json({ message: "Error uploading image", error });
	}
};
BookController.updateBook = async (req, res) => {
	try {
		const { id } = req.params;
		const book = await BookService.findById(id);
		if (!book) {
			return res.status(404).json({ message: "Book not found" });
		}
		const updatedBook = await BookService.updateBook(id, req.body);
		res.status(200).json(updatedBook);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

BookController.searchBooks = async (req, res) => {
	try {
		const query = req.query.q;
		const books = await BookService.searchBook(query);
		if (!books) {
			res.status(404).json({ message: "No books found" });
		}
		res.status(200).json(books);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

BookController.topChoices = async (req, res) => {
	try {
		const topBooks = await BookService.findTopBooks();
		if (!topBooks) {
			return res.status(404).json({ message: "No Data Available" });
		}
		res.status(200).json(topBooks);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

BookController.getAvailableBooks = async (req, res) => {
	try {
		const availableBooks = await BookService.getAvailableBooks();
		if (!availableBooks) {
			return res.status(404).json({ message: "No books found" });
		}

		res.json({ availableBooks: availableBooks[0]?.totalAvailable || 0 });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

BookController.getNewArrivals = async (req, res) => {
	try {
		const limit = parseInt(req.query.limit) || 5;
		const page = parseInt(req.query.page) || 1;
		const skip = (page - 1) * limit;
		const newArrivals = await BookService.findNewArrivals(limit, skip);
		const totalBooks = await BookService.countBooks();
		const totalPages = Math.ceil(totalBooks / limit);
		if (!newArrivals) {
			return res.status(404).json({ message: "No books found" });
		}
		res.status(200).json({
			newArrivals,
			pagination: { totalBooks, totalPages, currentPage: page, limit },
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

BookController.getMoreBooksLikeThis = async (req, res) => {
	try {
		const { id } = req.params;
		const book = await BookService.findById(id);
		if (!book) {
			return res.status(404).json({ message: "Book not found" });
		}
		const moreSimilarBooks = await BookService.findMoreBooksLikeThis(book);
		if (!moreSimilarBooks) {
			return res.status(404).json({ message: "No similar books found" });
		}
		res.status(200).json(moreSimilarBooks);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

BookController.getBooksByCategory = async (req, res) => {
	try {
		const limit = parseInt(req.query.limit) || 5;
		const page = parseInt(req.query.page) || 1;
		const skip = (page - 1) * limit;
		let { category } = req.params;
		category = category.toLowerCase();
		const data = await BookService.applyFilters(category, limit, skip);
		const totalData = await BookService.countBooks({ category });
		const totalPages = Math.ceil(totalData / limit);
		if (!data || data.length === 0) {
			return res.status(400).json({ error: "No books with this category" });
		}
		res.status(200).json({
			data,
			pagination: { totalData, totalPages, currentPage: page, limit },
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
BookController.getRecommendedBooks = async (req, res) => {
	try {
		const limit = parseInt(req.query.limit) || 5;
		const page = parseInt(req.query.page) || 1;
		const skip = (page - 1) * limit;

		const books = await BookService.findTopBooks(limit, skip);
		const totalBooks = await BookService.countBooks();
		const totalPages = Math.ceil(totalBooks / limit);
		if (!books) {
			return res.status(404).json({ message: "No books found" });
		}
		res.status(200).json({
			books,
			pagination: { totalBooks, totalPages, currentPage: page, limit },
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

BookController.getRecentlyBorrowedBooksByUser = async (req, res) => {
	try {
		const userId = req.user;
		const limit = parseInt(req.query.limit) || 5;
		const books = await BookService.getRecentlyBorrowedBooksByUser(
			userId,
			limit
		);

		if (!books || books.length === 0) {
			return res.status(404).json({ message: "No books borrowed" });
		}
		res.status(200).json(books);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

BookController.deleteBook = async (req, res) => {
	try {
		const { id } = req.params;

		const book = await BookService.findById(id);
		if (!book) {
			return res.status(404).json({ message: "Book not found" });
		}
		const deletedBook = await BookService.deleteBook(id);
		res.status(200).json({ deletedBook, message: "Book deleted Successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	BookController,
};
