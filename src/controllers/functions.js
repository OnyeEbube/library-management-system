const nodemailer = require("nodemailer");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const user = process.env.USER;
const pass = process.env.PASS;

const sendEmail = async (email, message, subject = "Hello") => {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		// Use `true` for port 465, `false` for all other ports
		auth: {
			user: user,
			pass: pass,
		},
	});
	const info = await transporter.sendMail({
		from: `"LMS📖🔖🔖" <${user}>`, // sender address
		to: email, // list of receivers
		subject: subject, // Subject line
		text: message, // plain text body
		html: `<b>${message}</b>`, // html body
	});

	console.log(`Message sent: ${info.messageId}`);
};

let currentPrefixIndex = 0; // Initialize the prefix index

// Function to get the next prefix letter
function getNextPrefix() {
	const prefix = String.fromCharCode(65 + currentPrefixIndex); // A=65 in ASCII
	currentPrefixIndex = (currentPrefixIndex + 1) % 26; // Cycle through A-Z
	return prefix;
}

// Function to generate a unique ID
function generateUniqueId() {
	const prefix = getNextPrefix();
	const digits = Math.floor(1000000000 + Math.random() * 9000000000); // Generate a random 10-digit number
	return prefix + digits;
}

const applyFilters = (query, filters) => {
	if (filters.role) {
		query = query.where("role").equals(filters.role);
	}
	if (filters.dateRange) {
		query = query
			.where("date")
			.gte(filters.dateRange.from)
			.lte(filters.dateRange.to);
	}
	if (filters.activity) {
		query = query.where("activity").equals(filters.activity);
	}
	if (filters.actions) {
		query = query.where("actions").equals(filters.actions);
	}
	if (filters.bookName) {
		query = query.where("bookName").equals(filters.bookName);
	}
	if (filters.numberOfBooksBorrowed) {
		query = query
			.where("numberOfBooksBorrowed")
			.equals(filters.numberOfBooksBorrowed);
	}
	if (filters.status) {
		query = query.where("status").equals(filters.status);
	}
	if (filters.memberName) {
		query = query.where("name").equals(filters.memberName);
	}
	return query;
};

module.exports = { sendEmail, generateUniqueId, applyFilters };
