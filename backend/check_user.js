require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const checkUser = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/med_ai_db';
        await mongoose.connect(uri);
        const users = await User.find({}, 'email name');
        console.log('Registered Users:');
        users.forEach(u => console.log(` - ${u.email} (${u.name})`));
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUser();
