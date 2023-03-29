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

app.use(express.json());
// Create GET request
app.get("/", (req, res) => {
  res.send("Express on Vercel");
});


// Initialize server
app.listen(5000, () => {
  console.log("Running on port 5000.");
});
module.exports = app;