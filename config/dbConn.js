require("dotenv").config();
const mongoose = require('mongoose');
const dbConn = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
        useNewUrlParser: true
        });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
    }
    module.exports = dbConn;