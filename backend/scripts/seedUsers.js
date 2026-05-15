const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: '../.env' });

const seedUsers = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/roadx';
    await mongoose.connect(mongoUri);
    console.log('Connected to DB');

    const admin = await User.findOne({ email: 'admin@roadaxe.in' });
    if (!admin) {
      await User.create({
        name: 'Admin',
        email: 'admin@roadaxe.in',
        password: 'ROADAXEadmin@#2026',
        role: 'admin'
      });
      console.log('Admin user created');
    } else {
      admin.password = 'ROADAXEadmin@#2026';
      await admin.save();
      console.log('Admin user updated');
    }

    const sales = await User.findOne({ email: 'sales@roadaxe.in' });
    if (!sales) {
      await User.create({
        name: 'Sales',
        email: 'sales@roadaxe.in',
        password: 'ROADAXEsales@#2026',
        role: 'admin' // or 'sales' if you have a sales role, but currently enum is ['user', 'dealer', 'admin']
      });
      console.log('Sales user created');
    } else {
      sales.password = 'ROADAXEsales@#2026';
      await sales.save();
      console.log('Sales user updated');
    }

    console.log('Users seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedUsers();
