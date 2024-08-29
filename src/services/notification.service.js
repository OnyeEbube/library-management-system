const Notification = require("../models/notifications.model");

const NotificationService = {};

NotificationService.createNotification = async (notification) => {
	const newNotification = new Notification(notification);
	return await newNotification.save();
};

/*NotificationService.getNotificationById = async (_id) => {
	return await Notification.findById(_id);
};
*/
NotificationService.getNotificationById = async (userId) => {
	return await Notification.find(userId) // Assuming notifications have a `userId` field
		.sort({ createdAt: -1 })
		.limit(20);
};

NotificationService.getNotification = async (filter) => {
	return await Notification.findOne(filter);
};

NotificationService.getNotifications = async () => {
	return await Notification.findAll();
};

module.exports = { NotificationService };
