const { NotificationService } = require("../services/notification.service");
const { UserService } = require("../services/auth.service");
const { RequestService } = require("../services/requests.service");
const { sendEmail } = require("./functions");

const NotificationController = {};

NotificationController.createNotification = async (req, res) => {
	try {
		const { message, description, requestId } = req.body;
		const request = await RequestService.findById(requestId);
		if (!request) {
			return res.status(404).json({ error: "Request does not exist" });
		}
		const userId = request.userId;
		const user = await UserService.getUserById(userId);
		if (!user) {
			return res.status(404).json({ error: "User does not exist" });
		}
		const notification = await NotificationService.createNotification({
			userId,
			message,
			description,
			requestId,
		});
		res.status(201).json(notification);
		sendEmail(user.email, description, message);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

NotificationController.createAdminNotification = async (req, res) => {
	try {
		const { message, description, userId, requestId } = req.body;
		const admin = UserService.getUsersByRole("ADMIN");
		if (!admin) {
			return res.status(404).json({ error: "Admin does not exist" });
		}
		const notification = await NotificationService.createNotification({
			admin,
			userId,
			message,
			description,
			requestId,
		});
		res.status(201).json(notification);
		sendEmail(admin.email, description, message);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

NotificationController.getNotifications = async (req, res) => {
	try {
		const userId = req.user.id;
		const notifications = await NotificationService.getNotifications(userId);
		res.status(200).json(notifications);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

NotificationController.markAsRead = async (req, res) => {
	try {
		const { id } = req.params;
		const notification = await NotificationService.markAsRead(id);
		res.status(200).json(notification);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = { NotificationController };
