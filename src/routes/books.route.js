const express = require("express");
const router = express.Router(); //;
const upload = require("../config/multer.js");
const { BookController } = require("../controllers/books.controller.js");
const {
	adminAuth,
	userAuth,
	verifyUser,
	blockUser,
} = require("../middleware/jwt.middleware.js");
const Book = require("../models/books.model.js");

//get all books
router.get("/", userAuth, BookController.getBooks);
router.get("/recommended-books", userAuth, BookController.getRecommendedBooks);
router.get("/category/:category", userAuth, BookController.getBooksByCategory);
router.get("/new-arrivals", userAuth, BookController.getNewArrivals);
router.get(
	"/recently-borrowed-books",
	userAuth,
	BookController.getRecentlyBorrowedBooksByUser
);
//search for a book
router.get("/search", userAuth, BookController.searchBooks);
router.get("/top-choices", userAuth, BookController.topChoices);
//get a book
router.get("/:id", userAuth, BookController.getBook);
//create a book
router.post("/", adminAuth, BookController.createBook);
//upload a book cover
router.post(
	"/uploads/:id",
	upload.single("coverImage"),
	adminAuth,
	BookController.uploadBookCover
);
//get a book cover
/*router.get("/uploads/:fileName", BookController.getBookCover);
 */
//update a book
router.put("/:id", adminAuth, BookController.updateBook);
//delete a book
router.delete("/:id", adminAuth, BookController.deleteBook);

module.exports = router;
