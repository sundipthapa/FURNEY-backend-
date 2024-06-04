const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      isFavorite: {
        type: Boolean,
        required: true
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
