const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
	name: String,
	firstName: String,
	lastName: String,
	dateOfBirth: Date,
	houseAddress: String,
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
		required: true,
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
		enum: ["ACTIVE", "BLOCKED"],
		default: "ACTIVE",
	},
	resetToken: String,
	passwordResetTokenExpiryTime: {
		type: Date,
		default: () => Date.now() + 15 * 60 * 1000, // Set expiry time to 15 minutes from now
	},
	role: { type: String, enum: ["ADMIN", "USER"] },

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

/*userSchema.pre("save", function (next) {
	const user = this;
	if (!user.isModified("password")) return next();
	bcrypt.hash(user.password, 10, function (err, hash) {
		if (err) {
			return next(err);
		}
		user.password = hash;
		next();
	});
});
*/

userSchema.index({ name: "text", email: "text" });

const User = mongoose.model("User", userSchema);
module.exports = User;
