const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    director: { type: String, required: true },
    genre: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    imageUrl: { type: String, default: '/img/default-movie.jpg' },
});

module.exports = mongoose.model('Movie', movieSchema);
