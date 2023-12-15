const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "/.env") }); //load .env variables

exports.getMain = (req, res, next) => {
  res.render(path.join(__dirname, "..", "views", "index.ejs"), {
    apiKey: process.env.GOOGLE_MAPS_JS_API,
    pageTitle: "Main-Map",
  });
};
