const User = require("../models/user.model");
const { applyFilters } = require("../controllers/functions");

const UserService = {};

UserService.getUser = async (filter, projection) => {
	return await User.findOne(filter, projection);
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

UserService.getFilteredMembers = async (filters, limit, skip) => {
	let query = User.find();
	query = applyFilters(query, filters);
	return await query.skip(skip).limit(limit).exec();
};

UserService.countFilteredUsers = async (filters) => {
	let query = User.find(); // Assuming `User` is your Mongoose model
	query = applyFilters(query, filters);
	return await query.countDocuments().exec();
};
UserService.addToFavorites = async (userId, bookId) => {
	return await User.findByIdAndUpdate(
		userId,
		{ $addToSet: { favoriteBooks: bookId } },
		{ new: true }
	);
};

UserService.removeFromFavorites = async (userId, bookId) => {
	return await User.findByIdAndUpdate(
		userId,
		{ $pull: { favoriteBooks: bookId } },
		{ new: true }
	).exec();
};

UserService.getNewMembersStat = async (startDate, endDate) => {
	return await User.aggregate([
		{
			$match: {
				createdAt: {
					$gte: startDate,
					$lt: endDate,
				},
			},
		},
		{
			$group: {
				_id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
				count: { $sum: 1 },
			},
		},
	]);
};
module.exports = { UserService };
