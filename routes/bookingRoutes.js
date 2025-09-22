const express = require('express');
const { createBooking, getUserBookings, getBookingById } = require('../controllers/bookingController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/', createBooking);
router.get('/', getUserBookings);
router.get('/:id', getBookingById);

module.exports = router;