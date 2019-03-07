import MessageModel from '../models/Message';

const Message = {
  createMessage(req, res) {
    const {
      subject, message, senderId, receiverId,
    } = req.body;

    if (!subject || !message || !senderId || !receiverId) { return res.status(400).json({ status: 400, error: 'All fields are required.' }); }

    const newMessage = MessageModel.create(req.body);
    return res.status(201).json({ status: 201, data: { ...newMessage } });
  },

  getAllReceived(req, res) {
    const messages = MessageModel.findAllReceived(req.user.id);
    return res.status(200).json({ status: 200, data: [...messages] });
  },

  getAllUnread(req, res) {
    const messages = MessageModel.findAllUnread(req.user.id);
    return res.status(200).json({ status: 200, data: [...messages] });
  },

  getAllSent(req, res) {
    const messages = MessageModel.findAllSent(req.user.id);
    return res.status(200).json({ status: 200, data: [...messages] });
  },

  getOne(req, res) {
    const message = MessageModel.findOne(Number(req.params.id));
    if (!message) { return res.status(404).json({ status: 404, error: 'Message not found.' }); }

    return res.status(200).json({ status: 200, data: { ...message } });
  },

  delete(req, res) {
    const message = MessageModel.findOne(Number(req.params.id));
    if (!message) { return res.status(404).json({ status: 404, error: 'Message not found.' }); }

    const ref = MessageModel.delete(Number(req.params.id));
    return res.status(204).json(ref);
  },


};
export default Message;
