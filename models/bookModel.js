const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    topic: { type: String, required: true },
    year: { type: Number, required: true },
    rating: { type: Number, min: 1, max: 5, required: true }, // 1-5 stars
    available: { type: Boolean, default: true }
});

bookSchema.index({ title: 'text', author: 'text', topic: 'text', year: 1 });

module.exports = mongoose.model('Book', bookSchema);