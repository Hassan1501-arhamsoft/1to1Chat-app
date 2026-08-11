import express from "express";

import { protect } from "../middlewares/auth.middleware.js";

import {
  sendMessage,
  getMessages,
} from "../controllers/message.controller.js";

const router = express.Router();

// Send Message
router.post("/", protect, sendMessage);

// Get Conversation
router.get("/:userId", protect, getMessages);
export default router;