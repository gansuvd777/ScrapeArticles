var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Create a new UserSchema object
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },

  img:{
    type: String,
  },

  isSaved:{
    type: Boolean,
    default: false
  },

  articleCreated: {
    type: Date,
    default: Date.now
  },
  note:[{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]

});

// Model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;