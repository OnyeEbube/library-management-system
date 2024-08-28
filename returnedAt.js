require("dotenv").config();
const mongoose = require("mongoose");
const Request = require("./src/models/request.model"); // Adjust the path to your Request model
const url = process.env.URL;

// MongoDB connection string

mongoose
	.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.log("Failed to connect to MongoDB", err));

const updateReturnedAtField = async () => {
	try {
		// Find all requests with status "Returned" that don't have the returnedAt field
		const requests = await Request.find({
			status: "Returned",
			returnedAt: { $exists: false },
		});

		// Update each request
		const updatePromises = requests.map((request) => {
			request.returnedAt = new Date(); // Set returnedAt to the current date and time
			return request.save();
		});

		// Wait for all updates to complete
		await Promise.all(updatePromises);

		console.log(
			`Updated ${updatePromises.length} requests with returnedAt field.`
		);
	} catch (error) {
		console.error("Error updating requests:", error);
	} finally {
		mongoose.connection.close(); // Close the connection when done
	}
};

updateReturnedAtField();
