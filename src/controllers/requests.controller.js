const { RequestService } = require("../services/requests.service");
const { BookService } = require("../services/books.service");
const { UserService } = require("../services/auth.service");
const RequestController = {};

RequestController.getRequests = async (req, res) => {
	try {
		const limit = req.query.limit;
		const skip = req.query.skip;
		const requests = await RequestService.findAll(limit, skip);
		const totalRequests = await RequestService.countRequests(); // count total books
		const totalPages = Math.ceil(totalRequests / limit);
		if (!requests) {
			res.status(400).json({ error: "No requests have been added" });
		}
		res.status(200).json({
			requests,
			pagination: {
				totalRequests,
				totalPages,
				currentPage: parseInt(req.query.page),
				limit,
			},
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

/*RequestController.createSpecialRequest = async (req, res) => {
	try {
		const { userId, userName } = req.body;
*/

RequestController.getRequest = async (req, res) => {
	try {
		const { id } = req.params;
		const request = await RequestService.findById(id);
		if (!request) {
			res.status(400).json({ error: "Request does not exist" });
		}
		res.status(200).json(request);
	} catch (error) {
		res.status(500).json(error);
	}
};

RequestController.createRequest = async (req, res) => {
	try {
		const { bookId } = req.params;
		console.log(bookId);

		// Check if the book exists
		const existingBook = await BookService.findOne({ _id: bookId });
		if (!existingBook) {
			//console.log(existingBook);
			return res.status(400).json({ error: "Book does not exist" });
		}
		if (existingBook.quantity === 0) {
			return res.status(400).json({ error: "Book is out of stock" });
		}

		// Extract user information
		const userId = req.user.id;
		const userName = req.user.name;

		// Check if the user information is available
		if (!userId || !userName) {
			return res.status(404).json({ error: "Please login to request a book" });
		}

		// Create the request with necessary information
		const requestPayload = {
			userId,
			userName,
			bookId,
		};
		const requests = await RequestService.createRequest(requestPayload);

		// Respond with the created request
		res.status(200).json(requests);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

RequestController.updateRequest = async (req, res) => {
	try {
		const { id } = req.params;
		const requests = await RequestService.findById(id);
		if (!requests) {
			return res.status(404).json({ message: "Request not found" });
		}
		const updatedRequest = await RequestService.updateRequest(id, req.body); // TODO: Update this endpoint to correct return date
		res.status(200).json(updatedRequest);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

RequestController.handleRequestAction = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		const bookRequest = await RequestService.findById(id);
		if (!bookRequest)
			return res.status(404).json({ error: "Request not found" });

		bookRequest.status = status;

		await bookRequest.save();

		const user = await UserService.getUserById(bookRequest.userId);
		const book = await BookService.findById(bookRequest.bookId);
		if (!user) return res.status(404).json({ error: "User not found" });
		if (!book) return res.status(404).json({ error: "Book not found" });

		if (status === "Approved") {
			user.numberOfBooksBorrowed += 1;
			book.borrowedBy.push(user._id);
			book.quantity -= 1;
			if (book.quantity === 0) {
				book.status = "Unavailable";
			}
		} else if (status === "Declined") {
			user.numberOfBooksBorrowed = user.numberOfBooksBorrowed;
		}

		await user.save();

		res.status(200).json({
			message: `Request ${status.toLowerCase()} successfully`,
			bookRequest,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

RequestController.handleReturnAction = async (req, res) => {
	try {
		const { id } = req.params; // Get request ID from URL parameters

		const bookRequest = await RequestService.findById(id);
		if (!bookRequest)
			return res.status(404).json({ error: "Request not found" }); // Check if the request exists

		const user = await UserService.getUserById(bookRequest.userId);
		const book = await BookService.findById(bookRequest.bookId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		if (!book) {
			return res.status(404).json({ error: "Book not found" });
		}

		// Logic to handle book return
		bookRequest.status = "Returned";
		user.numberOfBooksBorrowed -= 1;
		book.quantity += 1;
		book.borrowedBy = book.borrowedBy.filter(
			(borrowerId) => !borrowerId.equals(user._id)
		); // Remove user from borrowedBy array

		if (book.quantity > 0) {
			book.status = "Available"; // Update book status if there's at least one copy
		}

		await bookRequest.save();
		await book.save();
		await user.save();

		res.status(200).json({
			message: "Book returned successfully",
			bookRequest,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

RequestController.cancelRequest = async (req, res) => {
	try {
		const { id } = req.params;
		const bookRequest = await RequestService.findById(id);
		if (!bookRequest)
			return res.status(404).json({ error: "Request not found" });

		const user = await UserService.getUserById(bookRequest);
		const book = await BookService.findById(bookRequest.bookId);
		if (!user) return res.status(404).json({ error: "User not found" });
		if (!book) return res.status(404).json({ error: "Book not found" });
		bookRequest.status = "Cancelled";
		await bookRequest.save();
		res.status(200).json({
			message: "Request cancelled successfully",
			bookRequest,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

RequestController.deleteRequest = async (req, res) => {
	try {
		const { id } = req.params;

		const requests = await RequestService.findById(id);
		if (!requests) {
			return res.status(404).json({ message: "Request not found" });
		}
		const deletedRequest = await RequestService.deleteRequest(id);
		res
			.status(200)
			.json({ deletedRequest, message: "Request deleted Successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	RequestController,
};
