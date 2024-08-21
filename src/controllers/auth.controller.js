const jwt = require("jsonwebtoken");
const path = require("path");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { UserService } = require("../services/auth.service");
require("dotenv").config();
const { error } = require("console");
const user = process.env.USER;
const pass = process.env.PASS;
const baseUrl = process.env.FRONTEND_BASE_URL;
const functions = require("./functions");
//const mailgen = require("mailgen");

const AuthController = {};

AuthController.createUser = async (req, res) => {
	try {
		const uniqueId = generateUniqueId();
		const { name, email, password, role, image } = req.body;
		if (!image) {
			image = "/uploads/default.jpg";
		}
		const existingUser = await UserService.getUser({ email });
		if (existingUser) {
			return res.status(400).json({ error: "User already exists" });
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const createdUser = await UserService.createUser({
			name,
			email,
			password: hashedPassword,
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
		const { email, password, role } = req.body;

		const loggedinUser = await UserService.getUser({ email });
		if (!loggedinUser) {
			return res.status(401).json({ error: "User doesn't exist" });
		}
		const isPasswordMatch = bcrypt.compare(password, loggedinUser.password);
		console.log(isPasswordMatch);

		if (!isPasswordMatch) {
			return res.status(401).json({ error: "Invalid credential" });
		}
		const token = jwt.sign({ _id: loggedinUser._id }, process.env.SECRET_KEY, {
			expiresIn: process.env.SECRET_KEY_EXPIRES_IN,
		});
		const user = await UserService.getUser(
			{ _id: loggedinUser._id },
			{ password: 0 }
		);
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

AuthController.uploadImage = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await UserService.getUserById(id);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		if (!req.files || req.files.length === 0) {
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
		const uploadedUserImage = await UserService.uploadImage(id, image);
		res.json(uploadedUserImage);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

AuthController.searchMembers = async (req, res) => {
	try {
		const query = req.query.q;
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
		const skip = (page - 1) * limit;
		const users = await UserService.getUsers(limit, skip);
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

AuthController.verifyToken = async (req, res) => {
	const { resetToken } = req.params;

	const user = await UserService.getUser({ resetToken });
	if (!user) {
		return res.status(400).json({ message: "Invalid Token" });
	}
	res.status(200).json({ message: "Token verified successfully", user });
	await UserService.updateUser({ user, resetToken: "" });
};

AuthController.resetPassword = async (req, res) => {
	const { email } = req.body;
	const { password } = req.body;
	//const { id } = user;
	const hashedPassword = await bcrypt.hash(password, 10);
	UserService.updateUser(email, { password: hashedPassword });
	res.status(200).json({ message: "Password reset successful" });
	sendEmail(
		email,
		"Password reset successful",
		"Your password has been reset successfully"
	);
};

module.exports = { AuthController };
