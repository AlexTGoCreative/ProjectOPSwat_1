const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

function connectDB() {
    return mongoose.connect(process.env.MongoDB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

module.exports = connectDB;
