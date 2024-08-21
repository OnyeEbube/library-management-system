const express = require("express");
const router = express.Router(); //;
const { BookController } = require("../controllers/books.controller.js");
const {
	adminAuth,
	userAuth,
	verifyUser,
} = require("../middleware/jwt.middleware.js");

//get all books
router.get("/", userAuth, BookController.getBooks);
//search for a book
router.get("/search", userAuth, BookController.searchBooks);
//get a book
router.get("/:id", userAuth, BookController.getBook);
//create a book
router.post("/", adminAuth, BookController.createBook);
//upload a book cover
router.post("/uploads/:id", adminAuth, BookController.uploadBookCover);
//get a book cover
/*router.get("/uploads/:fileName", BookController.getBookCover);
 */
//update a book
router.put("/:id", adminAuth, BookController.updateBook);
//delete a book
router.delete("/:id", adminAuth, BookController.deleteBook);

module.exports = router;
