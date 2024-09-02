const mongoose = require("mongoose");

const BlacklistSchema = mongoose.Schema(
	{
		token: { type: String, required: true, unique: true },
		expiresAt: { type: Date, required: true },
	},
	{ timestamps: true }
);

const Blacklist = mongoose.model("Blacklist", BlacklistSchema);

module.exports = Blacklist;
