const mongoose = require("mongoose");

 async function dbConnect() {
  try {
    await mongoose.connect(
process.env.CONNECT_URL
    );
    console.log("dataBase is connected")
  } catch (err) {
    console.log(err);
  }
}


module.exports={dbConnect}