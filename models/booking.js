const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  checkIn: {
    type: Date,
    required: [true, 'Please provide check-in date']
  },
  checkOut: {
    type: Date,
    required: [true, 'Please provide check-out date']
  },
  guests: {
    type: Number,
    required: [true, 'Please provide number of guests'],
    min: [1, 'At least 1 guest is required'],
    max: [4, 'Maximum 4 guests per room']
  },
  totalPrice: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Calculate total price before saving
bookingSchema.pre('save', async function(next) {
  if (this.isModified('checkIn') || this.isModified('checkOut') || this.isModified('room')) {
    const Room = mongoose.model('Room');
    const room = await Room.findById(this.room);
    
    if (room) {
      const nights = Math.ceil((this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24));
      this.totalPrice = room.price * nights;
    }
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);