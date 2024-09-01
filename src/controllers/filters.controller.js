const FilterController = {};

const { UserService } = require("../services/auth.service");
const { RequestService } = require("../services/requests.service");
const { BookService } = require("../services/books.service");

//app.get("/api/filter", async (req, res) => {
FilterController.getFilteredData = async (req, res) => {
	try {
		const { resource, ...filters } = req.query;
		const resourceLowerCase = resource.toLowerCase();
		const filtersLowerCase = {};
		for (const [key, value] of Object.entries(filters)) {
			filtersLowerCase[key] =
				typeof value === "string" ? value.toLowerCase() : value;
		}
		let data;

		switch (resourceLowerCase) {
			case "users":
				data = await UserService.applyFilters(filtersLowerCase);
				break;
			case "requests":
				data = await RequestService.applyFilters(filtersLowerCase);
				break;
			case "books":
				data = await BookService.applyFilters(filtersLowerCase);
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
