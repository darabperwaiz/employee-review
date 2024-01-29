const mongoose = require('mongoose');
const dotenv = require('dotenv')
mongoose.connect(process.env.DATABASE_URI);
const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to db"));

db.once('open', function(){
    console.log("connected to DB"); 
})

module.exports=db;