// Dependencies
let express = require("express");
let bodyParser = require("body-parser");
let logger = require("morgan");
var method = require("method-override");
let mongoose = require("mongoose");


let PORT = process.env.PORT || 3000;

let localDB = 'mongodb://localhost/HeadlinesDB';
let MONGODB_URI = process.env.MONGODB_URI || localDB;

mongoose.connect(MONGODB_URI);

// Database configuration with mongoose
mongoose.Promise = Promise;

let db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Initialize Express
let app = express();


// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(method("_method"));

// Make public a static dir
app.use(express.static("public"));

// Set Handlebars.
let expressHandlebars = require("express-handlebars");

app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require("./routes/routes.js")(app);

// Listen on PORT 3000
app.listen(PORT, function() {
  console.log("App is running on PORT " + PORT);
});
