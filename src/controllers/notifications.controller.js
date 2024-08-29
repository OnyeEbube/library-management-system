const { NotificationService } = require("../services/notification.service");
const { UserService } = require("../services/auth.service");
const Notification = require("../models/notifications.model");

const NotificationController = {};

NotificationController.getNotificationById = async (req, res) => {
	try {
		const { userId } = req.params;
		const notifications = await NotificationService.getNotificationById({
			userId: userId,
		});
		res.status(200).json(notifications);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

NotificationController.createNotification = async (req, res) => {
	try {
		const { userId, message, type } = req.body;
		const user = await UserService.getUserById(userId);
		if (!user) {
			return res.status(400).json({ error: "User does not exist" });
		}

		const notification = await NotificationService.createNotification({
			userId,
			message,
			type,
		});
		res.status(201).json(notification);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
NotificationController.markAsRead = async (req, res) => {
	const { notificationId } = req.params;
	try {
		const updateNotification = await Notification.findByIdAndUpdate(
			notificationId,
			{ read: true },
			{ new: true } // This returns the updated document
		);
		if (!updateNotification) {
			return res.status(400).json({ error: "Notification does not exist" });
		}

		res.status(200).json({ success: true, data: updateNotification });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

NotificationController.getReadNotifications = async (req, res) => {
	try {
		const notifications = await Notification.find({ read: true });
		res.status(200).json(notifications);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

NotificationController.getUnreadNotifications = async (req, res) => {
	try {
		const notifications = await Notification.find({ read: false });
		res.status(200).json(notifications);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
module.exports = { NotificationController };
