// region imports
const { ALLOWED_ORIGINS } = require("./index");
// endregion

// region cors options
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
// endregion

// region exports
module.exports = corsOptions;
// endregion
