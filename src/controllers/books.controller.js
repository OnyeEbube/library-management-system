const Book = require("../models/books.model.js");
const { BookService } = require("../services/books.service.js");
const path = require("path");
const BookController = {};

BookController.getBooks = async (req, res) => {
	try {
		const limit = req.query.limit || 5;
		const page = req.query.page || 1;
		const skip = (page - 1) * limit;
		const books = await BookService.findAll(limit, skip);
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
				currentPage: parseInt(req.query.page),
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
			res.status(400).json({ error: "Book does not exist" });
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
			res.status(400).json({ error: "Book already exists" });
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
		const book = await BookService.findById(id);
		if (!book) {
			return res.status(404).json({ error: "book not found" });
		}

		if (!req.files || !req.files.imageFile) {
			//console.log(req.files);
			return res.status(400).json({ error: "Please upload an image" });
		}
		const imageFile = req.files.imageFile;
		const uploadPath = path.join(__dirname, "uploads", imageFile.name);

		// Move the file to the "uploads" directory
		imageFile.mv(uploadPath, async (err) => {
			if (err) {
				return res.status(500).json({ error: err.message });
			}
		});

		// Save the image path to the database
		const image = `/uploads/${imageFile.name}`;
		const uploadedBookCover = await BookService.uploadBookCover(id, image);
		res.json(uploadedBookCover);
	} catch (dbRrror) {
		res.status(500).json({ error: dbRrror.message });
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
