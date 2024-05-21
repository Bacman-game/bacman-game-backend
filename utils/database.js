const mongoose = require('mongoose');

require('dotenv').config();
 
let isConnected = false;

const connectToDB = async() => {
    mongoose.set('strictQuery', true);
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'production',
        });
        isConnected = true;
    } catch (error) {
        console.log(error);
    }     
}

module.exports = connectToDB;