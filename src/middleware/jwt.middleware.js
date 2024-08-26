const jwt = require("jsonwebtoken");
const { UserService } = require("../services/auth.service.js");

const adminAuth = async (req, res, next) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		if (!token) {
			return res.status(401).json({ error: "No token provided" });
		}

		const decoded = jwt.verify(token, process.env.SECRET_KEY);
		console.log(decoded);
		// const user = await User.findById({ _id: decoded._id }).select("-password");

		const user = await UserService.getUserById(decoded._id);

		console.log(user);
		if (!user) {
			return res.status(401).json({ error: "Invalid token" });
		}
		if (user.role == "USER") {
			return res.status(403).json({ error: "Access denied" });
		}
		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({ error: "Invalid token" });
	}
};

const userAuth = async (req, res, next) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		if (!token) {
			return res.status(401).json({ error: "No token provided" });
		}

		const decoded = jwt.verify(token, process.env.SECRET_KEY);
		console.log(decoded);
		// const user = await User.findById({ _id: decoded._id }).select("-password");

		const user = await UserService.getUserById(decoded._id);

		console.log(user);
		if (!user) {
			return res.status(401).json({ error: "Invalid token" });
		}

		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({ error: "Invalid token" });
	}
};

const verifyUser = (req, res, next) => {
	try {
		// Get the token from the headers
		const token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(token, process.env.SECRET_KEY); // Replace with your JWT secret

		// Extract the user ID from the token
		const loggedInUserId = decoded._id;

		// Get the user ID from the request parameters
		const { id } = req.params.id;

		// Compare the IDs
		if (id === loggedInUserId) {
			console.log(`loggedInUserId: ${loggedInUserId}, id: ${id}`);
			return res.status(200).json({});
		}

		req.userId = loggedInUserId;

		// Proceed to the next middleware or route handler
		next();
	} catch (error) {
		return res.status(401).json({ error: "Unauthorized access." });
	}
};

/*const borrowLimit = async (req, res, next) => {
	try {
		const user = req.user;
		const books = await BookService.getBooks({ status: "BORROWED" });
		const borrowedBooks = books.filter((book) => book.borrower == user._id);
		if (borrowedBooks.length >= 5) {
			return res.status(403).json({ error: "Borrow limit reached" });
		}
		next();
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};
*/

module.exports = { adminAuth, userAuth, verifyUser };
