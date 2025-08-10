const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MaterialSchema = new Schema({
  materialName: { type: String },
  pageNumber: { type: Number },
  text: { type: String },
  chapter: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Material', MaterialSchema);