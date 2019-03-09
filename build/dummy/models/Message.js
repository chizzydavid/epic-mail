"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Message =
/*#__PURE__*/
function () {
  function Message() {
    _classCallCheck(this, Message);

    this.messages = [];
  }

  _createClass(Message, [{
    key: "create",
    value: function create(data) {
      var newMessage = {
        id: data.id,
        subject: data.subject,
        message: data.message,
        parentMessageId: data.parentMessageId,
        senderId: data.senderId,
        receiverId: data.receiverId,
        createdOn: Date.now(),
        status: data.status
      };
      this.messages.push(newMessage);
      return newMessage;
    }
  }, {
    key: "findAllReceived",
    value: function findAllReceived(id) {
      var received = this.messages.filter(function (message) {
        return message.receiverId === id;
      });
      return received;
    }
  }, {
    key: "findAllUnread",
    value: function findAllUnread(id) {
      // assuming message status remains 'sent' until the receiver reads it and its marked as 'read';
      var received = this.findAllReceived(id);
      var unread = received.filter(function (message) {
        return message.status === 'sent';
      });
      return unread;
    }
  }, {
    key: "findAllSent",
    value: function findAllSent(id) {
      var sent = this.messages.filter(function (message) {
        return message.senderId === id;
      });
      return sent;
    }
  }, {
    key: "findOne",
    value: function findOne(id) {
      var foundMessage = this.messages.find(function (message) {
        return message.id === id;
      });
      return foundMessage;
    }
  }, {
    key: "delete",
    value: function _delete(id) {
      var message = this.findOne(id);
      var index = this.messages.indexOf(message);
      this.messages.splice(index, 1);
      return {};
    }
  }]);

  return Message;
}();

var _default = new Message();

exports.default = _default;
//# sourceMappingURL=Message.js.map