const mongoose = require("mongoose");

/* 
	const oneMonthFrom = (date) => {
	const newDate = new Date(date);
	newDate.setMonth(newDate.getMonth() + 1);
	return newDate;
};
*/

const RequestSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		userName: {
			type: String,
			required: true,
			set: (val) => val.toLowerCase(),
		},

		isSpecialRequest: {
			type: Boolean,
			default: false, // Default to false, set to true for special requests
		},

		bookName: {
			type: String,
			required: false,
			set: (val) => val.toLowerCase(),
		},

		bookId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Book",
			required: function () {
				return !this.isSpecialRequest; // Required for normal requests, not for special requests
			},
		},

		status: {
			type: String,
			enum: ["pending", "approved", "declined", "returned", "cancelled"],
			default: "pending",
			set: (val) => val.toLowerCase(),
		},
		returnedAt: { type: Date },

		borrowedAt: { type: Date },

		timeRequested: { type: Date, default: Date.now },

		//time_approved: { type: Date },

		//time_rejected: { type: Date },

		time_expired: { type: Date },
	},

	{ timestamp: true }
);

/*RequestSchema.pre("save", function (next) {
	if (this.isModified("status")) {
		if (this.status === "Approved" && !this.time_approved) {
			this.time_approved = new Date();
			this.time_expired = oneMonthFrom(this.time_approved);
		} else if (this.status === "Rejected" && !this.time_rejected) {
			this.time_rejected = new Date();
		}
	}
	next();
});
*/
const Request = mongoose.model("Request", RequestSchema);
module.exports = Request;
