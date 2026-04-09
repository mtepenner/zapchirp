// controllers/contact.controller.js
import User from '../models/user.model.js';

export const addContact = async (req, res) => {
    const { name, email } = req.body;
    const userId = req.user._id;

    try {
        const newContact = await User.findOneAndUpdate(
            { name },
            { email },
            { $addToSet: { contacts: userId } },
            { new: true }
        );

        if (!newContact) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { contacts: newContact._id } },
            { new: true }
        );

        // Get the socket.io instance
        const io = req.app.get('socketio');
        io.emit('new_contact', newContact);

        res.status(201).json(newContact);
    } catch (error) {
        console.error('Error adding contact:', error.message);
        res.status(500).json({ message: 'Error adding contact' });
    }
};