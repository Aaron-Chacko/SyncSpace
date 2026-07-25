const Room = require('../models/Room');

module.exports = async (req, res, next) => {
  try {
    const roomId = req.params.roomId || req.params.id || req.body.roomId;
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized for this room' });
    }

    req.room = room;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
