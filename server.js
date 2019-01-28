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

// // Connect to the Mongo DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/ScrapeArticles";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// if(process.env.MONGODB_URI)
// 	mongoose.connect(process.env.MONGODB_URI);
// else
// 	mongoose.connect("mongodb://localhost/ScrapeArticles");
// Database configuration with mongoose

// Show any mongoose errors
mongoose.connection.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
mongoose.connection.once("open", function() {
    console.log("Mongoose connection successful.");
});

// Routes
require("./routes/api_routes.js")(app);

// Start the server
app.listen(PORT, () => {
  console.log("App running on port 🌎 " + PORT + "!");
});