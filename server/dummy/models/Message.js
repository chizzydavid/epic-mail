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
      status: data.status,
    };

    this.messages.push(newMessage);
    return newMessage;
  }

}

export default new Message();
