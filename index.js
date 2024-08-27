require("dotenv").config();
const bookRoute = require("./src/routes/books.route.js");
const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const path = require("path");
const authRoutes = require("./src/routes/auth.routes.js");
const requestRoute = require("./src/routes/requests.routes.js");
const { connect } = require("mongoose");
const reviewRoute = require("./src/routes/review.routes.js");
const url = process.env.URL;
const port = process.env.PORT;
const cors = require("cors");

// middleware
app.use(
	cors(/*{
		origin: "http://localhost:5173",
		credentials: true,
	}*/)
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
const uploadsPath = path.join(__dirname, "controllers", "uploads");
app.use("/uploads", express.static(uploadsPath));
// routes
app.use("/api/requests", requestRoute);
app.use("/api/books", bookRoute);
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoute);

app.get("/", async (req, res) => {
	res.send("Hello from Node API Updated");
});

connect(url)
	.then(() => {
		console.log("Connected to database!");
		app.listen(port, () => {
			console.log("Server is running on port 3000");
		});
	})
	.catch((error) => {
		console.log(error);
	});
