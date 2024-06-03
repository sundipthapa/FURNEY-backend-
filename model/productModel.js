const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String, default:"new" },
    price: { type: Number, required: true },
    email: { type: String, default :""},
    phoneno: { type: String, default :""},
    address: { type: String, default :""},
    images: [String],
    isTrending: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});




module.exports = mongoose.model('Product', productSchema);
