const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router.post("/", messageController.sendMessage);
router.get("/product/:id", messageController.getMessagesByProduct);
router.get("/user/:id", messageController.getMessagesByUser);

module.exports = router;