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
			type: String,
			required: true,
		},

		userName: {
			type: String,
			required: true,
		},

		bookName: {
			type: String,
			required: true,
		},

		bookId: {
			type: String,
			required: true,
		},

		status: {
			type: String,
			enum: ["Pending", "Approved", "Declined", "Returned"],
			default: "Pending",
		},

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
