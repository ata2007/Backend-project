const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Please provide a room category'],
    enum: ['Single', 'Double', 'Suite', 'Deluxe'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide a room price'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Please provide a room description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  amenities: [{
    type: String,
    trim: true
  }],
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/300x200?text=Room+Image'
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Room', roomSchema);