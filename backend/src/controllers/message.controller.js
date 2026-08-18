import {
  createMessage,
  getConversation,
} from "../services/message.service.js";

// Send Message
export const sendMessage = async (req, res, next) => {
  try {
    const sender = req.user._id;

    const { receiver, message } = req.body;

    const newMessage = await createMessage( //!  i don't remove this await because we need the updated data from the db.
      sender,
      receiver,
      message
    );

    res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

// Get Conversation
export const getMessages = async (req, res, next) => {
  try {
    const user1 = req.user._id;
    // console.log(req)
    const { userId } = req.params;

    const page = parseInt(req.query.page) || 1;
    const limit = 20;

    const messages = await getConversation( //! this await is necessary to ensure we retrieve the messages before returning them.
      user1,
      userId,
      page,
      limit
    );

    res.status(200).json({
      success: true,
      data: messages,
      hasMore: messages.length === limit,
    });
  } catch (error) {
    next(error);
  }
};