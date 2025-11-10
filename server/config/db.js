// server/config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Use the MongoDB URI defined in your server/.env file
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // These options are standard boilerplate and may be deprecated in new Mongoose versions,
            // but they ensure compatibility with older versions.
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error connecting to MongoDB: ${err.message}`);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;