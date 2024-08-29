const Notification = require("../models/notifications.model");

const NotificationService = {};

NotificationService.createNotification = async (notification) => {
	const newNotification = new Notification(notification);
	return await newNotification.save();
};

NotificationService.getNotificationById = async (id) => {
	return await Notification.findById(id);
};

NotificationService.getNotifications = async (userId) => {
	return await Notification.find({ userId });
};

NotificationService.markAsRead = async (id) => {
	const notification = await Notification.findById(id);
	notification.read = true;
	return await notification.save();
};

module.exports = { NotificationService };
