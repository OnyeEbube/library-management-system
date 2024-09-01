const User = require("../models/user.model");
const { applyFilters } = require("../controllers/functions");

const UserService = {};

UserService.getUser = async (filter, projection) => {
	return await User.findOne(filter, projection);
};

UserService.getUserById = async (id) => {
	return await User.findById({ _id: id }).select("-password").exec();
};

UserService.getUsersByRole = async (role = "ADMIN") => {
	return await User.find({ role }).select("-password").exec();
};

UserService.countUsers = async () => {
	return await User.countDocuments();
};

UserService.getUsers = async (filter = null, limit, skip) => {
	return await User.find(filter).limit(limit).skip(skip).select("-password");
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

UserService.applyFilters = async (filters) => {
	let query = User.find();
	if (filters.role) {
		query = query.where("role").equals(filters.role);
	}
	if (filters.dateRange) {
		query = query
			.where("createdAt")
			.gte(filters.dateRange.from)
			.lte(filters.dateRange.to);
	}
	if (filters.activity) {
		query = query.where("activity").equals(filters.activity);
	}
	if (filters.numberOfBooksBorrowed) {
		query = query
			.where("numberOfBooksBorrowed")
			.equals(filters.numberOfBooksBorrowed);
	}
	if (filters.name) {
		query = query.where("name").equals(filters.name.trim());
	}
	if (filters.memberID) {
		query = query.where("uniqueId").equals(filters.memberID.trim());
	}
	return await query.exec();
};

UserService.countFilteredUsers = async (filters, role = "USER") => {
	let query = User.find({ role }); // Assuming `User` is your Mongoose model
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
		{ $sort: { _id: 1 } },
	]);
};
module.exports = { UserService };
