import Message from "../models/message.model.js";

// Create a 1-on-1 message
export const createMessage = async (
  sender,
  receiver,
  message,
  status = "sent"
) => {
  const newMessage = await Message.create({ //! this await is necessary to ensure the message is saved before we attempt to retrieve it with populate.
    sender,
    receiver,
    message,
    status,
  });

  return await Message.findById(newMessage._id) //! await is necessary to ensure we retrieve the message with populated fields before returning it.
    .populate("sender", "name")
    .populate("receiver", "name");
};

// Mark messages as read
export const markMessagesAsRead = async (
  senderId,
  receiverId
) => {
  //! remove the "return" here because we don't need to return anything from this function, we just want to mark the messages as read in the database.
  //! this await is necessary to ensure we update the messages before continuing, even though we don't return anything from this function.
  await Message.updateMany(
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
// Get conversation between two users
export const getConversation = async (
  user1,
  user2,
  page = 1,
  limit = 20
) => {
  const skip = (page - 1) * limit;

  const messages = await Message.find({ //! this await is necessary to ensure we retrieve the messages before returning them.
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


