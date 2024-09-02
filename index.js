require("dotenv").config();
const bookRoute = require("./src/routes/books.route.js");
const express = require("express");
const app = express();
//const fileUpload = require("express-fileupload");
//const path = require("path");
const authRoutes = require("./src/routes/auth.routes.js");
const requestRoute = require("./src/routes/requests.routes.js");
const notificationRoute = require("./src/routes/notifications.route.js");
const filtersRoute = require("./src/routes/filters.routes");
const Blacklist = require("./src/models/blacklist.model.js"); // Adjust path as necessary
const { connect } = require("mongoose");
const reviewRoute = require("./src/routes/review.routes.js");
const url = process.env.URL;
const port = process.env.PORT;
const cors = require("cors");

// middleware
/*app.use(
	cors({});
*/
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(fileUpload());
//const uploadsPath = path.join(__dirname, "controllers", "uploads");
//app.use("/uploads", express.static(uploadsPath));
// routes
app.use("/api/requests", requestRoute);
app.use("/api/books", bookRoute);
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/filter", filtersRoute);

app.get("/", async (req, res) => {
	res.send("Hello from Node API Updated");
});

const removeExpiredTokens = async () => {
	const now = new Date();
	try {
		await Blacklist.deleteMany({ expiresAt: { $lt: now } });
		console.log("Expired tokens removed");
	} catch (error) {
		console.error("Error removing expired tokens:", error);
	}
};

setInterval(removeExpiredTokens, 60 * 120 * 1000); // 2 hours

connect(url)
	.then(() => {
		console.log("Connected to database!");
		app.listen(port, () => {
			console.log("Server is running on port 3000");
		});
	})
	.catch((error) => {
		console.error("Failed to connect to database:", error.message);
	});

app.keepAliveTimeout = 120000; // 120 seconds
app.headersTimeout = 120000;
