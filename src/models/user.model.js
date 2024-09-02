const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
	name: { type: String, set: (val) => val.toLowerCase() },
	firstName: { type: String, default: "", set: (val) => val.toLowerCase() },
	lastName: { type: String, default: "", set: (val) => val.toLowerCase() },
	dateOfBirth: Date,
	houseAddress: { type: String, default: "", set: (val) => val.toLowerCase() },
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	favoriteBooks: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Book",
		},
	],
	uniqueId: {
		type: String,
		required: false,
		unique: true, // Ensure the uniqueId field is unique in the database
		index: true, // Create an index for the uniqueId field for faster querying
	},
	email: { type: String, required: true },
	password: { type: String, required: true },
	image: {
		type: String,
		required: false,
	},
	numberOfBooksBorrowed: {
		type: Number,
		default: 0,
	},
	activity: {
		type: String,
		enum: ["active", "blocked", "inactive"],
		default: "inactive",
		set: (val) => val.toLowerCase(),
	},
	resetToken: String,
	passwordResetTokenExpiryTime: {
		type: Date,
		default: () => Date.now() + 15 * 60 * 1000, // Set expiry time to 15 minutes from now
	},
	role: {
		type: String,
		enum: ["admin", "user"],
		set: (val) => val.toLowerCase(),
		default: "user",
	},

	booksBorrowed: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Book",
		},
	],

	phoneNumber: {
		type: String,
		required: false,
	},
});

userSchema.index({ name: "text", email: "text" });

const User = mongoose.model("User", userSchema);
module.exports = User;
