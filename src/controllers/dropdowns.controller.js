const User = require("../models/user.model");
const Book = require("../models/books.model");
const Request = require("../models/request.model");
const DropdownController = {};

DropdownController.activityStatus = async (req, res) => {
	try {
		// Fetch distinct values for the activity status
		const activityStatuses = await User.distinct("activity");
		res.json(activityStatuses);
	} catch (error) {
		res.status(500).json({ message: "Error fetching activity statuses" });
	}
};

DropdownController.booksBorrowed = async (req, res) => {
	try {
		// Fetch distinct values for the number of books borrowed
		const borrowedCounts = await User.distinct("numberOfBooksBorrowed");
		res.json(borrowedCounts);
	} catch (error) {
		res.status(500).json({ message: "Error fetching borrowed books count" });
	}
};

DropdownController.nameSorting = async (req, res) => {
	try {
		// Fetch all user names
		const users = await User.find({}, "firstName lastName").sort({
			firstName: 1,
			lastName: 1,
		});
		const nameList = users.map((user) => `${user.firstName} ${user.lastName}`);
		res.json(nameList);
	} catch (error) {
		res.status(500).json({ message: "Error fetching user names" });
	}
};

DropdownController.year = async (req, res) => {
	try {
		const years = await Book.distinct("year");
		res.json(years);
	} catch (error) {
		res.status(500).json({ message: "Error fetching book years" });
	}
};

DropdownController.category = async (req, res) => {
	try {
		const categories = await Book.distinct("category");
		res.json(categories);
	} catch (error) {
		res.status(500).json({ message: "Error fetching categories" });
	}
};
DropdownController.availability = async (req, res) => {
	try {
		const availability = await Book.distinct("availability");
		res.json(availability);
	} catch (error) {
		res.status(500).json({ message: "Error fetching availabilities" });
	}
};
DropdownController.author = async (req, res) => {
	try {
		const authors = await Book.distinct("author").sort();
		res.json(authors);
	} catch (error) {
		res.status(500).json({ message: "Error fetching authors" });
	}
};

DropdownController.bookName = async (req, res) => {
	try {
		const bookName = await Request.distinct("bookName");
		res.json(bookName);
	} catch (error) {
		res.status(500).json({ message: "Error fetching book names" });
	}
};

DropdownController.requestStatus = async (req, res) => {
	try {
		const requestStatus = await Request.distinct("status");
		res.json(requestStatus);
	} catch (error) {
		res.status(500).json({ message: "Error fetching request status" });
	}
};
module.exports = { DropdownController };
