// region imports
const app = require("./app");
const { PORT } = require("./config");
const connectDB = require("./config/db");
// endregion

// region server start

try {
  connectDB();
  app.listen(PORT, () => console.log(` Server running on port ${PORT}...`));
} catch (err) {
  console.log("error ", err);
  process.exit();
}

// endregion
