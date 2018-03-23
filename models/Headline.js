const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let HeadlineSchema = new Schema({

  title: {
    type: String,
    requires: true
  },
  link: {
    type: String,
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }
});

let Headline = mongoose.model('Headline', HeadlineSchema);

module.exports = Headline;
