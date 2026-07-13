require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rn_agritech');
        console.log('MongoDB Connected');

        // Check if admin already exists
        const existing = await User.findOne({ email: 'admin@gmail.com' });
        if (existing) {
            console.log('Admin user already exists. Updating role to admin...');
            existing.role = 'admin';
            await existing.save();
            console.log('Admin role updated!');
        } else {
            await User.create({
                name: 'Admin',
                email: 'admin@gmail.com',
                password: '123456',
                role: 'admin'
            });
            console.log('Admin user created successfully!');
        }

        console.log('Email: admin@gmail.com');
        console.log('Password: 123456');

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

seedAdmin();
