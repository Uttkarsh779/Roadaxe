const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // Password hashed inside User pre-save if we use User.create or we can supply raw here if we use findOneAndUpdate
    // Wait, findOneAndUpdate doesn't trigger pre-save hooks reliably. We should use create or trigger save manually.
    // Let's pass raw password and let mongoose handle it if we use new User().save()
    
    const testUsers = [
      {
        name: 'Admin User',
        email: 'admin@roadx.in',
        role: 'admin',
        password: 'password123'
      },
      {
        name: 'Dealer User',
        email: 'dealer@roadx.in',
        role: 'dealer',
        password: 'password123'
      },
      {
        name: 'Customer User',
        email: 'user@roadx.in',
        role: 'user',
        password: 'password123'
      }
    ];

    for (const u of testUsers) {
      // remove old user if exists
      await User.deleteOne({ email: u.email });
      // create new user to trigger pre-save hook
      await User.create(u);
      console.log(`User created: ${u.role} (${u.email})`);
    }

    console.log('Test users created successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createUsers();
