const Booking = require('../models/booking');
const Room = require('../models/room');
const User = require('../models/user');

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('room')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const booking = await Booking.findById(req.params.id).populate('room');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    booking.status = status;
    
    // If booking is checked-out or cancelled, make room available again
    if (status === 'checked-out' || status === 'cancelled') {
      const room = await Room.findById(booking.room._id);
      room.isAvailable = true;
      await room.save();
    }
    
    await booking.save();
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get revenue summary
const getRevenueSummary = async (req, res) => {
  try {
    const revenueData = await Booking.aggregate([
      {
        $match: {
          status: { $in: ['confirmed', 'checked-in', 'checked-out'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1 }
      }
    ]);
    
    res.json(revenueData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new room
const createRoom = async (req, res) => {
  try {
    const { category, price, description, amenities, imageUrl } = req.body;
    
    const room = await Room.create({
      category,
      price,
      description,
      amenities,
      imageUrl
    });
    
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a room
const updateRoom = async (req, res) => {
  try {
    const { category, price, description, amenities, imageUrl, isAvailable } = req.body;
    
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      {
        category,
        price,
        description,
        amenities,
        imageUrl,
        isAvailable
      },
      { new: true, runValidators: true }
    );
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBookings,
  updateBookingStatus,
  getRevenueSummary,
  createRoom,
  updateRoom
};