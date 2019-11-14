const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({

  image: String,
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;