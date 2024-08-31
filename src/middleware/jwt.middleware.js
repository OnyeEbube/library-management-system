const jwt = require("jsonwebtoken");
const { UserService } = require("../services/auth.service.js");
const { RequestService } = require("../services/requests.service.js");
const { request } = require("express");

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

const blockUser = async (req, res, next) => {
	try {
		const userId = req.user.id || req.params.userId;

		const user = await UserService.getUserById(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (user.activity === "BLOCKED") {
			return res
				.status(403)
				.json({ message: "Access denied. User is blocked." });
		}
		next();
	} catch (error) {
		console.error("Error checking blocked status:", error);
		res.status(500).json({ message: "Internal server error" });
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
		const { id } = req.params;

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

const borrowLimit = async (req, res, next) => {
	try {
		const user = req.user;
		const userId = user._id;

		const requests = await RequestService.findAll(userId);
		console.log(requests);
		const count = 0;
		for (request in requests) {
			if (request.status === "Approved" || request.status === "Pending") {
				count++;
			}
		}
		if (count >= 5) {
			return res
				.status(400)
				.json({ error: "You have reached your borrowing limit" });
		}
		next();
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

module.exports = { adminAuth, userAuth, verifyUser, blockUser, borrowLimit };
