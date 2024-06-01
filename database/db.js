

const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL).then(() => {
      console.log("Connected to Database")
    })
  } catch (error) {
    console.error("Connection failed")
    process.exit(0)
  }

}

module.exports = connectDB;
