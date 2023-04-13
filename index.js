require("dotenv").config();
// Add Express
const express = require("express");
// Initialize Express
const app = express();
const cors=require('cors');
const dbConn = require("./config/dbConn");
app.use(cors());
// Connect to database
dbConn();

//handling uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down due to uncaught exception");
  process.exit(1);
});
//handling uncaught promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise rejection");
  server.close(() => {
    process.exit(1);
  });f
});

app.use(express.json());
app.use('users',require('./routes/userRoute'));
app.use('events',require('./routes/eventRoute'));

// Create GET request
app.get("/", (req, res) => {
  res.send("Express on Vercel");
});


// Initialize server
app.listen(5000, () => {
  console.log("Running on port 5000.");
});
module.exports = app;