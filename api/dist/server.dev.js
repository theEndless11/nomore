"use strict";

var express = require('express');

var mongoose = require('mongoose');

var Ably = require('ably');

var cors = require('cors');

require('dotenv').config(); // To load environment variables from .env file


var app = express();
var port = process.env.PORT || 3000; // MongoDB connection using environment variable

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  return console.log('MongoDB connected');
})["catch"](function (err) {
  return console.log('MongoDB connection error:', err);
}); // Import the Message model

var Message = require('./message'); // Import schema from message.js
// Use middleware


app.use(express.json());
app.use(cors()); // Initialize Ably with API Key from environment variable

var ably = new Ably.Realtime({
  key: process.env.ABLY_API_KEY
});
var publicChannel = ably.channels.get('chat'); // Listen for new messages on the public chat and save them to MongoDB

publicChannel.subscribe('message', function _callee(message) {
  var newMessage;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          newMessage = new Message({
            text: message.data.text
          });
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(newMessage.save());

        case 4:
          console.log('Message saved to DB:', message.data.text);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](1);
          console.error('Error saving message to DB:', _context.t0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 7]]);
}); // API to get all messages from the MongoDB database

app.get('/messages', function _callee2(req, res) {
  var messages;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Message.find().sort({
            timestamp: -1
          }));

        case 3:
          messages = _context2.sent;
          console.log('Fetched messages from DB:', messages); // Log fetched messages

          res.json(messages);
          _context2.next = 12;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.error('Error fetching messages:', _context2.t0);
          res.status(500).json({
            error: 'Failed to fetch messages'
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
}); // API to save new messages to MongoDB

app.post('/messages', function _callee3(req, res) {
  var text, newMessage;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          text = req.body.text;

          if (text) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: 'Message text is required'
          }));

        case 3:
          newMessage = new Message({
            text: text
          });
          _context3.prev = 4;
          _context3.next = 7;
          return regeneratorRuntime.awrap(newMessage.save());

        case 7:
          console.log('Message saved to DB:', text);
          res.status(201).json(newMessage); // Respond with the saved message

          _context3.next = 15;
          break;

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](4);
          console.error('Error saving message to DB:', _context3.t0);
          res.status(500).json({
            error: 'Failed to save message'
          });

        case 15:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[4, 11]]);
}); // Serve static files (HTML, JS, etc.) - if you have them in a public folder

app.use(express["static"]('public')); // Vercel Serverless Function (For deployment on Vercel)

module.exports = app;
//# sourceMappingURL=server.dev.js.map
