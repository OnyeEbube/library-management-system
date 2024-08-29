require("dotenv").config(); // Load environment variables from a .env file into process.env
const mongoose = require("mongoose");
const Request = require("./src/models/request.model");
const url = process.env.URL; // Adjust the path as needed

// Connect to your MongoDB database
mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const populateRequestDates = async () => {
	try {
		// Fetch all requests
		const requests = await Request.find();

		// Loop through each request and update the dates
		for (let request of requests) {
			// You can use whatever logic you have to set borrowedAt and returnedAt
			// For demonstration, setting them to some arbitrary dates
			const borrowedAt = request.borrowedAt || new Date(); // If borrowedAt doesn't exist, set it to now
			const returnedAt = request.returnedAt || null; // If returnedAt doesn't exist, set it to null

			// Update the request with the new dates
			await Request.updateOne(
				{ _id: request._id },
				{
					$set: {
						borrowedAt: borrowedAt,
						returnedAt: returnedAt,
					},
				}
			);
		}
		console.log(
			"All requests have been updated with borrowedAt and returnedAt fields."
		);
	} catch (error) {
		console.error("Error updating requests:", error);
	} finally {
		mongoose.connection.close();
	}
};

populateRequestDates();
