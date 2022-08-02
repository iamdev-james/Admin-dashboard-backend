const mongoose = require('mongoose');
require('dotenv').config();

// Mongo URI
const { MONGO_URI } = process.env;

const connect_DB = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('Sucessfully connected Database');
  }
  catch(error) {
    console.log('DB connection err', error.message)
  }
}

module.exports = connect_DB;