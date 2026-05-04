const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const seedUsers = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI is missing from .env");
      process.exit(1);
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');
    
    // Clean up invalid legacy users to allow index syncing
    await User.collection.deleteMany({ email: { $exists: false } });
    await User.collection.deleteMany({ email: null });

    // Drop any old indexes (like username or phone) that are no longer in the schema
    await User.syncIndexes();

    const testUsers = [
      {
        name: 'Admin User',
        email: 'admin@roadx.in',
        password: 'Admin@123',
        role: 'admin'
      },
      {
        name: 'Dealer User',
        email: 'dealer@roadx.in',
        password: 'Dealer@123',
        role: 'dealer'
      },
      {
        name: 'Customer User',
        email: 'user@roadx.in',
        password: 'User@123',
        role: 'user'
      }
    ];

    for (const u of testUsers) {
      await User.deleteOne({ email: u.email });
      await User.create(u); // Triggers the pre-save hook that hashes the password with bcrypt
      console.log(`User created/updated: ${u.role} (${u.email})`);
    }

    console.log('Test users seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedUsers();
