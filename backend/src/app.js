// region imports
const express = require("express");
const cors = require("cors");
const { requestLogger, errorHandler } = require("./middlewares");
const corsOptions = require("./config/corsOptions");
const apiRouter = require("./routes/index");
const notFound = require("./middlewares/notFound");
// endregion

// region app init
const app = express();
// endregion

// region middlewares
app.use(cors(corsOptions)); // enable CORS
app.use(express.json()); // MUST come before routes
app.use(requestLogger); // log all requests
// endregion

// region routes
app.use("/api", apiRouter); // mount API routes
// endregion

// region 404 handler 
app.use(notFound);
// endregion

// region error handler
app.use(errorHandler); // global error handler
// endregion

// region exports
module.exports = app;
// endregion
