// models/groupChat.model.js
import mongoose from 'mongoose';

const groupChatSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  createdAt: { type: Date, default: Date.now }
});

const GroupChat = mongoose.model('GroupChat', groupChatSchema);
export default GroupChat;