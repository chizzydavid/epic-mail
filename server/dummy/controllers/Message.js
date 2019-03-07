import MessageModel from '../models/Message';

const Message = {
  createMessage(req, res) {
    const {
      subject, message, senderId, receiverId,
    } = req.body;

    if (!subject || !message || !senderId || !receiverId) { return res.status(400).json({ status: 400, error: 'All fields are required.' }); }

    const newMessage = MessageModel.create(req.body);
    return res.status(201).json({ status: 201, data: {...newMessage} });
  },

};
export default Message;
