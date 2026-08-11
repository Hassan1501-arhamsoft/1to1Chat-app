import Message from "../models/message.model.js";

// Create a 1-on-1 message
export const createMessage = async (
  sender,
  receiver,
  message,
  status = "sent"
) => {
  const newMessage = await Message.create({
    sender,
    receiver,
    message,
    status,
  });

  return await Message.findById(newMessage._id)
    .populate("sender", "name")
    .populate("receiver", "name");
};

// Get conversation between two users
export const getConversation = async (
  user1,
  user2,
  page = 1,
  limit = 20
) => {
  const skip = (page - 1) * limit;

  const messages = await Message.find({
    $or: [
      {
        sender: user1,
        receiver: user2,
      },
      {
        sender: user2,
        receiver: user1,
      },
    ],
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("sender", "name")
    .populate("receiver", "name");

  return messages.reverse();
};

// Mark messages as read
export const markMessagesAsRead = async (
  senderId,
  receiverId
) => {
  return await Message.updateMany(
    {
      sender: senderId,
      receiver: receiverId,
      status: { $ne: "read" },
    },
    {
      $set: {
        status: "read",
      },
    }
  );
};