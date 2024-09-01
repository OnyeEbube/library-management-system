const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		message: {
			type: String,
			required: true,
		},

		description: {
			type: String,
			required: false,
			default: "",
		},

		read: {
			type: Boolean,
			default: false,
		},
		requestId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Request",
			required: true,
		},
		status: {
			type: String,
			enum: ["approved", "declined", "pending"],
			default: "pending",
			required: false,
			set: (val) => val.toLowerCase(),
		},

		createdAt: { type: Date, default: Date.now },
	},
	{ timestamp: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;
