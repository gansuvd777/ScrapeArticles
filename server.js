/* Scrape and Display
 * ================================================== */

// Dependencies
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

// Initialize Express
var PORT = process.env.PORT || 3000;
const app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Make public a static dir
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://pbsparent:secret7@ds113815.mlab.com:13815/heroku_8134xxt6";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes

require("./routes/api_routes.js")(app);

// Start the server
app.listen(PORT, () => {
  console.log("App running on port 🌎 " + PORT + "!");
});