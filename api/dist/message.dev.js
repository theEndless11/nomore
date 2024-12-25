"use strict";

var mongoose = require('mongoose'); // MongoDB Message Model


var messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    "default": Date.now
  }
});
var Message = mongoose.model('Message', messageSchema);
module.exports = Message;
//# sourceMappingURL=message.dev.js.map
