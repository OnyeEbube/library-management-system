const express = require("express");
const { RequestController } = require("../controllers/requests.controller");
const {
	adminAuth,
	userAuth,
	blockUser,
	borrowLimit,
} = require("../middleware/jwt.middleware");
const router = express.Router();

//get all requests
router.get("/", adminAuth, RequestController.getRequests);
//get a request
router.get(
	"/special-requests",
	adminAuth,
	RequestController.getSpecialRequests
);
router.get("/:id", adminAuth, RequestController.getRequest);
//create a request
router.post(
	"/special-request",
	userAuth,
	blockUser,
	RequestController.createSpecialRequest
);
router.post(
	"/:bookId",
	userAuth,
	blockUser,
	borrowLimit,
	RequestController.createRequest
);
//approve a request
router.post("/:id/approve", adminAuth, RequestController.handleRequestAction);
router.post("/:id/cancel", userAuth, RequestController.cancelRequest);
router.post("/:id/return", adminAuth, RequestController.handleReturnAction);
//update a request
router.put("/:id", adminAuth, RequestController.updateRequest);
//delete a request
router.delete("/:id", adminAuth, RequestController.deleteRequest);

module.exports = router;
