// const dns = require("node:dns");
// dns.setServers(['1.1.1.1', '1.0.0.1']); // Forces Cloudflare DNS resolution
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://pvsreerangateja1998_db_user:GYlUglEZfkAdaYge@cluster0.z7itfp9.mongodb.net/devTinder';

const connectDB = async () => {
    await mongoose.connect(MONGO_URI);
}

module.exports = connectDB;