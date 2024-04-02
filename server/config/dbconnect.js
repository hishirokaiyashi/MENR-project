const mongoose = require("mongoose"); 
// Connecting to database 
const dbConnect = mongoose.connect( 
  process.env.MONGODB_URI, 
  { 
    dbName: "MERN", 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
  }, 
  (err) => 
    err ? console.log(err) : console.log( 
      "Connected to yourDB-name database") 
); 

module.exports = dbConnect;