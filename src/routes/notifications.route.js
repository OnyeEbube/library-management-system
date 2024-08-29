const router = require("express").Router();
const {
	NotificationController,
} = require("../controllers/notifications.controller");
const { userAuth, adminAuth } = require("../middleware/jwt.middleware");
router.get("/read", userAuth, NotificationController.getReadNotifications);
router.get("/unread", userAuth, NotificationController.getUnreadNotifications);

router.get("/:userId", userAuth, NotificationController.getNotificationById);
router.put(
	"/:notificationId/read",
	userAuth,
	NotificationController.markAsRead
);

module.exports = router;
