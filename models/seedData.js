require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('./room');
const User = require('./user');

const connectDB = require('../config/database');

// Sample rooms data
const sampleRooms = [
  {
    category: 'Single',
    price: 100,
    description: 'Cozy single room with a comfortable bed and essential amenities',
    amenities: ['WiFi', 'TV', 'AC', 'Private Bathroom'],
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  },
  {
    category: 'Double',
    price: 150,
    description: 'Spacious double room perfect for couples or small families',
    amenities: ['WiFi', 'TV', 'AC', 'Mini-bar', 'Private Bathroom'],
    imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  },
  {
    category: 'Suite',
    price: 250,
    description: 'Luxurious suite with separate living area and premium amenities',
    amenities: ['WiFi', 'TV', 'AC', 'Mini-bar', 'Jacuzzi', 'Room Service', 'Private Bathroom'],
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  },
  {
    category: 'Deluxe',
    price: 200,
    description: 'Premium deluxe room with extra space and enhanced amenities',
    amenities: ['WiFi', 'TV', 'AC', 'Mini-bar', 'Coffee Maker', 'Private Bathroom'],
    imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  }
];

// Sample admin user
const sampleAdmin = {
  name: 'Admin User',
  email: 'admin@hotel.com',
  password: 'admin123',
  role: 'admin'
};

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Room.deleteMany({});
    console.log('Existing rooms cleared');
    
    // Insert sample rooms
    await Room.insertMany(sampleRooms);
    console.log('Sample rooms added');
    
    // Check if admin exists, if not create one
    const existingAdmin = await User.findOne({ email: sampleAdmin.email });
    if (!existingAdmin) {
      await User.create(sampleAdmin);
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }
    
    console.log('Data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();