const mongoose = require("mongoose");

async function dbconnection(url) {
  await mongoose.connect(url);
}

module.exports = dbconnection;
