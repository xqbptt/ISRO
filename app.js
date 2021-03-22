const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;

/**
 * Parser
 */
app.use(express.urlencoded({ extended: false }));

/**
 * Render Engine
 */
app.set("view engine", "ejs");

/**
 * Routes
 */
const landingPageRoutes = require("./routes/landingPageRoutes");
const toolRoutes = require("./routes/toolRoutes");
const adminRoutes = require("./routes/adminRoutes");

/**
 * middlewares
 */
app.use(express.static("static"));
app.use("/", landingPageRoutes);
app.use("/visualization", toolRoutes);
app.use("/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
