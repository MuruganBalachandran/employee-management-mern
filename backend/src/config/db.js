// region imports
const mongoose = require("mongoose");
const { MONGO_URI, MONGO_OPTIONS } = require("./index");
// endregion

// region database connection
const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MongoDB URI is not defined in the environment variables");
    }

    const conn = await mongoose.connect(MONGO_URI, MONGO_OPTIONS);

    console.log(
      ` MongoDB Connected: ${conn.connection.host} (Database: ${conn.connection.name})`
    );
  } catch (err) {
    console.error(
      ` MongoDB connection error: ${err?.message ?? err}`,
      err?.stack ?? ""
    );
    process.exit(1); // Stop the server if DB connection fails
  }
};
// endregion

// region exports
module.exports = connectDB;
// endregion
