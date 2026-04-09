// controllers/groupChat.controller.js
import GroupChat from '../models/groupChat.model.js';
import User from '../models/user.model.js';

export const createGroupChat = async (req, res) => {
  const { groupName, members } = req.body;

  if (!groupName || !members || members.length === 0) {
    return res.status(400).json({ message: 'Group name and members are required.' });
  }

  try {
    // Validate if all members exist
    const users = await User.find({ _id: { $in: members } });
    if (users.length !== members.length) {
      return res.status(400).json({ message: 'One or more members do not exist.' });
    }

    const groupChat = new GroupChat({ groupName, members });
    await groupChat.save();
    res.status(201).json(groupChat);
  } catch (error) {
    res.status(500).json({ message: 'Error creating group chat', error: error.message });
  }
};