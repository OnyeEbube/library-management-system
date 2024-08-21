const express = require("express");
const { AuthController } = require("../controllers/auth.controller");
const { userAuth, verifyUser } = require("../middleware/jwt.middleware");
const router = express.Router();

router.post("/register", AuthController.createUser);
router.post("/login" /*, userAuth*/, AuthController.loginUser);
router.post("/forgot-password", AuthController.forgotPassword);
router.put("/reset-password", AuthController.resetPassword);
router.get("/verify-token/:resetToken", AuthController.verifyToken);
router.get("/", AuthController.getUsers);
router.get("/me", userAuth, AuthController.getUser);
router.delete("/:id", AuthController.deleteUser);
router.patch("/:id", AuthController.updateUser);
//router.get("/logout", AuthController.logoutUser);
//router.get("/uploads/:fileName", AuthController.getProfilePicture);
router.post("/uploads/:id", verifyUser, AuthController.uploadImage);
router.get("/search", AuthController.searchMembers);

module.exports = router;
