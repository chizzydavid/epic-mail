import MessageModel from '../dummy/models/Message';
import UserModel from '../dummy/models/User';

const Message = {
  createMessage(req, res) {
    req.body.senderId = req.user.id;
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
    return res.status(200).json({ status: 200, message: 'Message successfully deleted.' });
  },

};
export default Message;
