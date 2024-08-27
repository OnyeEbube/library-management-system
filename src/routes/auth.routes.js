const express = require("express");
const { AuthController } = require("../controllers/auth.controller");
const {
	userAuth,
	verifyUser,
	adminAuth,
} = require("../middleware/jwt.middleware");
const router = express.Router();

router.post("/register", AuthController.createUser);
router.post("/login", AuthController.loginUser);
router.post("/forgot-password", AuthController.forgotPassword);
router.put("/reset-password", AuthController.resetPassword);
router.get("/verify-token/:resetToken", AuthController.verifyToken);
router.get("/", AuthController.getUsers);
router.get("/me", userAuth, AuthController.getUser);
router.delete("/:id", adminAuth, AuthController.deleteUser);
router.patch("/:id", adminAuth, userAuth, AuthController.updateUser);
router.get("/:id", adminAuth, AuthController.getFilteredMembers);
//router.get("/count", AuthController.countUsers);
router.put(
	"/:userId/:bookId/favorites",
	userAuth,
	AuthController.addToFavorites
);
router.delete(
	"/:userId/:bookId/favorites",
	userAuth,
	AuthController.removeFromFavorites
);
// router.get("/logout", AuthController.logoutUser);
//router.get("/uploads/:fileName", AuthController.getProfilePicture);
router.post("/uploads/:id", verifyUser, AuthController.uploadImage);
router.get("/search", userAuth, AuthController.searchMembers);

module.exports = router;
