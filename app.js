const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;

/**
 * Routes
 */
const landingPageRoutes = "./routes/landingPageRoutes.js";
const toolRoutes = "./routes/toolRoutes.js";

/**
 * middlewares
 */
app.use(express.static("static"));
// app.use("/", landingPageRoutes);
// app.use("/visualization/:visualizerName", toolRoutes);

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
