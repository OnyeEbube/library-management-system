const FilterController = {};

const { UserService } = require("../services/auth.service");
const { RequestService } = require("../services/requests.service");
const { BookService } = require("../services/books.service");

//app.get("/api/filter", async (req, res) => {
FilterController.getFilteredData = async (req, res) => {
	try {
		const { resource, ...filters } = req.query;
		let data;

		switch (resource) {
			case "users":
				data = await UserService.applyFilters(filters);
				break;
			case "requests":
				data = await RequestService.applyFilters(filters);
				break;
			case "books":
				data = await BookService.applyFilters(filters);
				break;
			default:
				return res.status(400).json({ error: "Invalid resource type" });
		}

		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = { FilterController };
