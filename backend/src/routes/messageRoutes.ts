import express from "express";
import {
    sendMessage,
    getMessages
} from "../controllers/messageController.ts";

const router = express.Router();

// send message
router.post("/", sendMessage);

// get messages for conversation
router.get("/:conversationId", getMessages);

export default router;