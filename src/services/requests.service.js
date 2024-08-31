const Request = require("../models/request.model.js");

const RequestService = {};

RequestService.findOne = async (filter) => {
	return await Request.findOne(filter);
};

RequestService.findAll = async (filter, limit, skip) => {
	return await Request.find(filter).limit(limit).skip(skip);
};

RequestService.countRequests = async (filter) => {
	return await Request.countDocuments(filter);
};

RequestService.getUserBorrowHistory = async (filter, limit, skip) => {
	const query = { ...filter, status: "Approved" };
	return await Request.find(query)
		.populate("bookId") // Assuming bookId is a reference to the Book model
		.limit(limit)
		.skip(skip)
		.sort({ borrowedAt: -1 }); // Sorting by borrow date, most recent first
};

RequestService.findById = async (id) => {
	return await Request.findById(id).exec();
};

RequestService.createRequest = async (data) => {
	const request = new Request(data);
	return await request.save();
};

RequestService.updateRequest = async (id, data) => {
	return await Request.findOneAndUpdate({ _id: id }, data, { new: true });
};

RequestService.deleteRequest = async (id) => {
	return await Request.findOneAndDelete({ _id: id });
};
RequestService.getBooksReturnedStats = async (startDate, endDate) => {
	return await Request.aggregate([
		{
			$match: {
				returnedAt: {
					$gte: startDate,
					$lt: endDate,
				},
			},
		},
		{
			$group: {
				_id: { $dateToString: { format: "%Y-%m-%d", date: "$returnedAt" } },
				count: { $sum: 1 },
			},
		},
	]);
};

module.exports = { RequestService };
