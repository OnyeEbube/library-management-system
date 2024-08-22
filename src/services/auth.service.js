const User = require("../models/user.model");

const UserService = {};

UserService.getUser = async (filter, projection = {}) => {
	const includePassword = Object.keys(projection).includes("password");
	return await User.findOne(filter).select(includePassword ? {} : projection);
};

UserService.getUserById = async (id) => {
	return await User.findById({ _id: id }).select("-password");
};

UserService.countUsers = async () => {
	return await User.countDocuments();
};

UserService.getUsers = async (limit, skip) => {
	return await User.find().limit(limit).skip(skip).select("-password");
};

UserService.searchMembers = async (query) => {
	return await User.find({ $text: { $search: query } }).select("-password");
};

UserService.createUser = async (data) => {
	const user = new User(data);
	return await user.save();
};

UserService.updateUser = async (id, data) => {
	return await User.findByIdAndUpdate(id, data, { new: true }).select(
		"-password"
	);
};

UserService.uploadImage = async (id, image) => {
	return await User.findByIdAndUpdate(id, { image }, { new: true }).select(
		"-password"
	);
};

UserService.deleteUser = async (id) => {
	return await User.findByIdAndDelete(id).select("-password");
};

module.exports = { UserService };
