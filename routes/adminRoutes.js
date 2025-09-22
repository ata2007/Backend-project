const express = require('express');
const { 
  getAllBookings, 
  updateBookingStatus, 
  getRevenueSummary, 
  createRoom, 
  updateRoom 
} = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.use(auth, admin);

router.get('/bookings', getAllBookings);
router.patch('/bookings/:id/status', updateBookingStatus);
router.get('/revenue', getRevenueSummary);
router.post('/rooms', createRoom);
router.put('/rooms/:id', updateRoom);

module.exports = router;