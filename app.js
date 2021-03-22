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
const landingPageRoutes = require("./routes/landingPageRoutes.js");
const toolRoutes = require("./routes/toolRoutes");

/**
 * middlewares
 */
app.use('/assets', express.static('assets'));
app.use("/", landingPageRoutes);
app.use("/visualization", toolRoutes);

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
