const express = require("express");
const { AuthController } = require("../controllers/auth.controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {
	userAuth,
	verifyUser,
	adminAuth,
	blockUser,
} = require("../middleware/jwt.middleware");
const { verify } = require("jsonwebtoken");
const router = express.Router();

router.post(
	"/uploads/:id",
	upload.single("profileImage"),
	AuthController.uploadImage
);
router.post("/register", AuthController.createUser);
router.post("/login", AuthController.loginUser);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/forgot-password-mobile", AuthController.forgotPasswordMobile);
router.get("/verify-otp-mobile", AuthController.verifyOTPMobile);
router.put("/reset-password", AuthController.resetPassword);
router.get("/members-only", adminAuth, AuthController.getMembersOnly);
router.get("/verify-token/:resetToken", AuthController.verifyToken);
router.get("/", adminAuth, AuthController.getUsers);
router.get(
	"/:id/borrow-history",
	userAuth,
	AuthController.getUserBorrowHistory
);
router.get("/me", userAuth, AuthController.getUser2);
router.get("/:id", userAuth, AuthController.getUser1);
router.delete("/:id", adminAuth, AuthController.deleteUser);
router.patch("/:id", adminAuth, userAuth, AuthController.updateUser);

router.get("/me/summary", adminAuth, AuthController.summary);
router.get("/me/member-stat", adminAuth, AuthController.newMembersStat);
router.get("/me/member-stat-two", adminAuth, AuthController.membersStat);
router.get(
	"/me/books-returned-stat",
	adminAuth,
	AuthController.booksReturnedStat
);
//router.get("/count", AuthController.countUsers);
router.put("/favorites", userAuth, blockUser, AuthController.addToFavorites);
router.put(
	"/remove-favorites",
	userAuth,
	blockUser,
	AuthController.removeFromFavorites
);
router.put("/:id/block", adminAuth, AuthController.blockUser);
router.get("/logout", AuthController.logout);
//router.get("/uploads/:fileName", AuthController.getProfilePicture);

router.get("/search", userAuth, AuthController.searchMembers);

module.exports = router;
