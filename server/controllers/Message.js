import db from '../db';

const Message = {
  createMessage(req, res) {
    const newMessage = MessageModel.create(req.body);
    return res.status(201).json({ status: 201, data: { ...newMessage } });
  },

  getAllReceived(req, res) {
    const user = UserModel.findUser(req.body.id);
    if (!user) return res.status(400).json({ status: 400, error: 'This user is not found.' });
    const messages = MessageModel.findAllReceived(req.body.id);
    return res.status(200).json({ status: 200, data: [...messages] });
  },

  getAllUnread(req, res) {
    const user = UserModel.findUser(req.body.id);
    if (!user) return res.status(404).json({ status: 404, error: 'This user is not found.' });
    const messages = MessageModel.findAllUnread(req.body.id);
    return res.status(200).json({ status: 200, data: [...messages] });
  },

  getAllSent(req, res) {
    const user = UserModel.findUser(req.body.id);
    if (!user) return res.status(404).json({ status: 404, error: 'This user is not found.' });
    const messages = MessageModel.findAllSent(req.body.id);
    return res.status(200).json({ status: 200, data: [...messages] });
  },

  getOne(req, res) {
    const user = UserModel.findUser(req.body.id);
    if (!user) return res.status(404).json({ status: 404, error: 'This user is not found.' });
    const message = MessageModel.findOne(Number(req.params.id));

    if (!message) { return res.status(404).json({ status: 404, error: 'Message not found.' }); }
    return res.status(200).json({ status: 200, data: { ...message } });
  },

  delete(req, res) {
    const user = UserModel.findUser(req.body.id);
    if (!user) return res.status(404).json({ status: 404, error: 'This user is not found.' });

    const message = MessageModel.findOne(Number(req.params.id));
    if (!message) { return res.status(404).json({ status: 404, error: 'Message not found.' }); }
    const ref = MessageModel.delete(Number(req.params.id));
    return res.status(200).json({ status: 200, message: 'Message successfully deleted.' });
  },

};
export default Message;
