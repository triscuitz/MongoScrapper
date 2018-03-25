let mongoose = require("mongoose");
let Note = require("./Note.js");

// Create Schema class
let Schema = mongoose.Schema;

// Create article schema
let ArticleSchema = new Schema({
  // title is a required string
  title: {
    type: String,
    required: true
  },
  // link is a required string
  link: {
    type: String,
    required: true
  },
  // ref refers to the Note model
  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});

// Create the Article model with the ArticleSchema
let Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;
