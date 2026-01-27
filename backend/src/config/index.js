// region imports
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") }); // load .env from project root
// endregion

// region parse JSON env safely
const parseJsonEnv = (key, defaultValue = {}) => {
  try {
    const value = process.env[key] ?? "";
    return value ? JSON.parse(value) : defaultValue;
  } catch (err) {
    console.warn(` Invalid JSON in env ${key}, using default.`);
    return defaultValue;
  }
};
// endregion

// region mongo config
const MONGO_CONFIG = parseJsonEnv("MONGO_URI", { uri: "", options: {} });
// endregion

// region export config
module.exports = {
  PORT: process.env.PORT ?? 5000,
  MONGO_URI: MONGO_CONFIG?.uri ?? "",
  MONGO_OPTIONS: MONGO_CONFIG?.options ?? {},
  ALLOWED_ORIGINS: parseJsonEnv("ALLOWED_ORIGINS", []),
  JWT_SECRET: process.env.JWT_SECRET ?? "defaultsecret",
};
// endregion
