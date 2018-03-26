const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const method = require("method-override");
const mongoose = require("mongoose");

let PORT = process.env.PORT || 3000;

// mongoose
let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/HeadlinesDB';
mongoose.connect(MONGODB_URI);
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

// express
let app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(method("_method"));

// static public
app.use(express.static("public"));

// handlebars
let expressHandlebars = require("express-handlebars");
app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require("./routes/routes.js")(app);

app.listen(PORT, function() {
  console.log("App is running on PORT " + PORT);
});
