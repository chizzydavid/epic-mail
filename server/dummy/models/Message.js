class Message {
  constructor() {
    this.messages = [];
  }

  create(data) {
    const newMessage = {
      id: data.id,
      subject: data.subject,
      message: data.message,
      parentMessageId: data.parentMessageId,
      senderId: data.senderId,
      receiverId: data.receiverId,
      createdOn: Date.now(),
      status: "sent",
    };

    this.messages.push(newMessage);
    return newMessage;
  }

  findAllReceived(id) {
    const received = this.messages.filter(message => message.receiverId === id);
    return received;
  }

  findAllUnread(id) {
    // assuming message status remains 'sent' until the receiver reads it and its marked as 'read';
    const received = this.findAllReceived(id);
    const unread = received.filter(message => message.status === 'sent');
    return unread;
  }

  findAllSent(id) {
    const sent = this.messages.filter(message => message.senderId === id);
    return sent;
  }

  findOne(id) {
    const foundMessage = this.messages.find(message => message.id === id);
    return foundMessage;
  }

  delete(id) {
    const message = this.findOne(id);
    const index = this.messages.indexOf(message);
    this.messages.splice(index, 1);
    return {};
  }
}

export default new Message();
