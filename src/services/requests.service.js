const Request = require("../models/request.model.js");

const RequestService = {};

RequestService.findOne = async (filter) => {
	return await Request.findOne(filter);
};

RequestService.findAll = async (limit, skip) => {
	return await Request.find().limit(limit).skip(skip);
};

RequestService.countRequests = async () => {
	return await Request.countDocuments();
};

RequestService.findById = async (id) => {
	return await Request.findById(id);
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

module.exports = { RequestService };
