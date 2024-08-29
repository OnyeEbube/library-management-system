const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema(
	{
		adminId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
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

		createdAt: { type: Date, default: Date.now },
	},
	{ timestamp: true }
);
NotificationSchema.pre("save", async function (next) {
	const user = await mongoose.model("User").findById(this.adminId);

	if (user && user.role === "ADMIN") {
		next();
	} else {
		const err = new Error("adminId must reference a user with the ADMIN role");
		next(err);
	}
});

const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;
