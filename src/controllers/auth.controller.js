require("dotenv").config();
const jwt = require("jsonwebtoken");
//const path = require("path");
const upload = require("../config/multer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { UserService } = require("../services/auth.service");
const { BookService } = require("../services/books.service");
const { RequestService } = require("../services/requests.service");
const Blacklist = require("../models/blacklist.model");

const baseUrl = process.env.FRONTEND_BASE_URL;
const {
	sendEmail,
	generateUniqueId,
	calculateDateRange,
	generateOTP,
	createOTPWithExpiry,
	clearToken,
} = require("./functions");
const e = require("express");

const AuthController = {};

AuthController.createUser = async (req, res) => {
	try {
		const uniqueId = generateUniqueId();
		let { name, email, role, image } = req.body;
		if (!image) {
			image = "/uploads/default.jpg";
		}
		const existingUser = await UserService.getUser({ email });
		if (existingUser) {
			return res.status(400).json({ error: "User already exists" });
		}
		const hash = await bcrypt.hash(req.body.password, 10);
		const createdUser = await UserService.createUser({
			name,
			email,
			password: hash,
			image,
			role,
			uniqueId,
		});
		const token = jwt.sign({ _id: createdUser._id }, process.env.SECRET_KEY, {
			expiresIn: process.env.SECRET_KEY_EXPIRES_IN,
		});
		const user = await UserService.getUser(
			{ _id: createdUser._id },
			{ password: 0 }
		);
		res.status(201).json({
			message: "Sign up successful",
			user,
			token,
		});
		sendEmail(email, "Sign up successful", "Welcome to LMS");
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

AuthController.loginUser = async (req, res) => {
	try {
		const { email } = req.body;

		const loggedinUser = await UserService.getUser({ email });

		if (!loggedinUser) {
			return res.status(401).json({ error: "User doesn't exist" });
		}
		const hashedPassword = loggedinUser.password;

		const isMatch = await bcrypt.compare(req.body.password, hashedPassword);

		if (!isMatch) {
			return res.status(401).json({ error: "Invalid credential" });
		}
		const token = jwt.sign({ _id: loggedinUser._id }, process.env.SECRET_KEY, {
			expiresIn: process.env.SECRET_KEY_EXPIRES_IN,
		});
		const user = await UserService.getUser(
			{ _id: loggedinUser._id },
			{ password: 0 }
		);
		user.activity = "active";
		await user.save();
		res.status(201).json({
			message: "Log in successful",
			user,
			token,
		});
		sendEmail(
			email,
			"Log in successful",
			"You just logged in to your account on LMS"
		);
	} catch (error) {
		res.status(500).json({ message: error.message });
		console.error(error);
	}
};

AuthController.summary = async (req, res) => {
	try {
		const totalUsers = await UserService.countUsers();
		const availableBooks = await BookService.getAvailableBooks();
		const totalBorrowedBooks = await BookService.countBorrowedBooks();
		const damagedBooks = await BookService.countBooks({ status: "damaged" });
		if (
			!totalUsers &&
			!availableBooks &&
			!totalBorrowedBooks &&
			!damagedBooks
		) {
			return res.status(404).json({ error: "No data found" });
		}

		res.status(200).json({
			totalUsers,
			availableBooks,
			totalBorrowedBooks,
			damagedBooks,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

AuthController.membersStat = async (req, res) => {
	try {
		const activeMembers = await UserService.getActiveMembersCount();
		const inactiveMembers = await UserService.getInactiveMembersCount();
		const blockedMembers = await UserService.getBlockedMembersCount();
		const newMembers = await UserService.getRecentlyAddedMembersCount();
		if (!activeMembers && !inactiveMembers && !blockedMembers && !newMembers) {
			return res.status(404).json({ error: "No data found" });
		}
		res.status(200).json({
			activeMembers,
			inactiveMembers,
			blockedMembers,
			newMembers,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

AuthController.newMembersStat = async (req, res) => {
	const { period = "month" } = req.query;
	const { startDate, endDate } = calculateDateRange(period);

	try {
		const newMembers = await UserService.getNewMembersStat(startDate, endDate);
		res.status(200).json(newMembers);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

AuthController.booksReturnedStat = async (req, res) => {
	const { period = "month" } = req.query;
	const { startDate, endDate } = calculateDateRange(period);

	try {
		const booksReturned = await RequestService.getBooksReturnedStats(
			startDate,
			endDate
		);
		res.status(200).json(booksReturned);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

AuthController.uploadImage = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await UserService.getUserById(id);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		if (!req.file) {
			return res.status(400).json({ error: "Please upload an image" });
		}
		const profileImageUrl = req.file.path || req.file.url;
		console.log(profileImageUrl);
		user.image = profileImageUrl;
		await user.save();
		res.status(200).json({ message: "Profile picture uploaded successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

AuthController.searchMembers = async (req, res) => {
	try {
		let query = req.query.q;
		query = query.toLowerCase();
		const users = await UserService.searchMembers(query);
		if (!users) {
			return res.status(404).json({ error: "No user found" });
		}
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

AuthController.getUser = async (req, res) => {
	try {
		console.log(req.user);
		const { id } = req.user;
		const user = await UserService.getUserById(id);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		res.json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

AuthController.getUsers = async (req, res) => {
	try {
		const limit = req.query.limit || 5;
		const page = req.query.page || 1;
		const filter = null;
		const skip = (page - 1) * limit;
		const users = await UserService.getUsers(filter, limit, skip);
		const totalUsers = await UserService.countUsers(); // count total books
		const totalPages = Math.ceil(totalUsers / limit);
		if (!users) {
			res.status(404).json({ error: "No users have been added" });
		}
		res.status(200).json({
			users,
			pagination: {
				totalUsers,
				totalPages,
				currentPage: page,
				limit,
			},
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

AuthController.updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const updatedUser = await UserService.updateUser(id, req.body);
		if (!updatedUser) {
			return res.status(400).json("User does not exist");
		}
		res.json(updatedUser);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

AuthController.blockUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await UserService.getUserById(id);
		if (!user) {
			return res.status(404).json({ message: "This user does not exist" });
		}
		user.activity = "blocked";
		await user.save();
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
AuthController.deleteUser = async (req, res) => {
	try {
		const { id } = req.params;
		const deletedUser = await UserService.deleteUser(id);
		if (!deletedUser) {
			return res.status(400).json("User does not exist");
		}
		res.status(201).json({ message: "User deleted successfully", deletedUser });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

AuthController.forgotPassword = async (req, res, next) => {
	const { email } = req.body;
	const user = await UserService.getUser({ email });
	if (!user) {
		res.status(400).json({ error: "This user does not exist!" });
	}
	const { id } = user;
	const resetToken = crypto.randomBytes(16).toString("hex");
	/*const hashedResetToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");
		*/
	UserService.updateUser(
		id,
		{ $set: { resetToken: resetToken } },
		(err, result) => {
			if (err) {
				console.error(err);
			} else {
				console.log(result);
			}
		}
	);
	sendEmail(
		email,
		`${baseUrl}/${resetToken}  Kindly click this link to verify your token`
	);
	res
		.status(200)
		.json({ message: "You should receive an email with your token" });
};

AuthController.forgotPasswordMobile = async (req, res, next) => {
	try {
		const { email } = req.body;
		const user = await UserService.getUser({ email });
		if (!user) {
			return res.status(400).json({ error: "This user does not exist!" });
		}
		const { id } = user;
		const { otp, expiryTime } = createOTPWithExpiry();
		UserService.updateUser(id, {
			$set: { resetToken: otp, passwordResetTokenExpiryTime: expiryTime },
		});
		console.log("OTP saved to user:", otp);
		sendEmail(email, `${otp}  Here is your OTP`);

		res
			.status(200)
			.json({ message: "You should receive an email with your OTP" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

AuthController.verifyOTPMobile = async (req, res) => {
	try {
		const { email, otp } = req.body;
		const user = await UserService.getUser({ email });
		if (!user) {
			return res.status(400).json({ message: "Invalid OTP" });
		}
		const { resetToken, passwordResetTokenExpiryTime } = user;
		const now = new Date();
		if (now > passwordResetTokenExpiryTime) {
			return res.status(400).json({ message: "OTP has expired" });
		}
		if (resetToken !== otp) {
			return res.status(400).json({ message: "Invalid OTP" });
		}
		res.status(200).json({ message: "OTP verified successfully" });
		clearToken(user._id);
	} catch (error) {
		res.status(500).json({ message: error.message });
		clearToken(user._id);
	}
};

AuthController.verifyToken = async (req, res) => {
	const { resetToken } = req.params;

	const user = await UserService.getUser({ resetToken });
	if (!user) {
		return res.status(400).json({ message: "Invalid Token" });
	}
	res.status(200).json({ message: "Token verified successfully", user });
	clearToken(user._id);
};

AuthController.resetPassword = async (req, res) => {
	try {
		const { email } = req.body;
		const { password } = req.body;
		const { confirmPassword } = req.body;
		user = await UserService.getUser({ email });
		if (!user) {
			return res.status(400).json({ error: "User does not exist" });
		}
		const id = user._id;
		if (password !== confirmPassword || !password || !confirmPassword) {
			return res.status(400).json({ error: "Passwords do not match" });
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const updatedUser = await UserService.updateUser(id, {
			$set: { password: hashedPassword },
		});
		console.log(updatedUser);
		res.status(200).json({ message: "Password reset successful" });
		sendEmail(
			email,
			"Password reset successful",
			"Your password has been reset successfully"
		);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

AuthController.addToFavorites = async (req, res) => {
	try {
		const id = req.user._id;
		const { bookId } = req.body;
		const user = await UserService.getUserById(id);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		const updatedUser = await UserService.addToFavorites(id, bookId);
		res.status(200).json(updatedUser);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

AuthController.removeFromFavorites = async (req, res) => {
	try {
		const userId = req.user._id;
		const { bookId } = req.body;
		const user = await UserService.getUserById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		const updatedUser = await UserService.removeFromFavorites(userId, bookId);
		res.status(200).json(updatedUser);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

AuthController.getMembersOnly = async (req, res) => {
	try {
		const limit = parseInt(req.query.limit) || 5;
		const page = parseInt(req.query.page) || 1;
		const skip = (page - 1) * limit;
		filter = { role: "user" };
		const members = await UserService.getUsers(filter, limit, skip);
		if (!members) {
			return res.status(404).json({ message: "No members found" });
		}
		const totalRequests = await RequestService.countRequests(); // count total books
		const totalPages = Math.ceil(totalRequests / limit);
		res.status(200).json({
			members,
			pagination: {
				totalRequests,
				totalPages,
				currentPage: page,
				limit,
			},
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

AuthController.getUserBorrowHistory = async (req, res) => {
	try {
		const limit = req.query.limit || 5;
		const page = req.query.page || 1;
		const skip = (page - 1) * limit;
		const { userId } = req.params;
		const borrowHistory = await RequestService.getUserBorrowHistory(userId);
		if (!borrowHistory) {
			return res.status(404).json({ message: "No books borrowed" });
		}
		const totalRequests = await RequestService.countRequests(); // count total books
		const totalPages = Math.ceil(totalRequests / limit);
		res.status(200).json({
			borrowHistory,
			pagination: {
				totalRequests,
				totalPages,
				currentPage: page,
				limit,
			},
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

AuthController.logout = async (req, res) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			return res
				.status(400)
				.json({ message: "Authorization header is missing" });
		}

		const token = authHeader.split(" ")[1];
		if (!token) {
			return res.status(400).json({ message: "Token is missing" });
		}

		// Decode token to get its expiration date
		const decoded = jwt.decode(token);
		if (!decoded || !decoded.exp) {
			return res.status(400).json({ message: "Invalid token" });
		}

		// Create blacklist entry with token and expiration date
		const expiresAt = new Date(decoded.exp * 1000); // Convert seconds to milliseconds
		await Blacklist.create({ token, expiresAt });
		req.user.activity = "inactive";
		await req.user.save();

		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = { AuthController };
