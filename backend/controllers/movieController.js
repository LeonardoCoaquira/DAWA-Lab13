const Movie = require('../models/movie');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Obtener todas las películas
exports.getMovies = (req, res) => {
    Movie.find()
        .then((movies) => {
            // Mapear las películas para incluir la URL completa de la imagen
            const moviesWithImageUrl = movies.map(movie => {
                return {
                    ...movie._doc,
                    imageUrl: req.protocol + '://' + req.get('host') + movie.imageUrl
                };
            });

            res.json(moviesWithImageUrl);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};

// Obtener una película por su ID
exports.getMovieById = (req, res) => {
    Movie.findById(req.params.id)
        .then((movie) => {
            if (!movie) {
                return res.status(404).json({ message: 'Película no encontrada' });
            }
            res.json(movie);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};

// Crear una nueva película con multer para manejar la imagen
exports.createMovie = (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const newMovie = new Movie({
            title: req.body.title,
            director: req.body.director,
            genre: req.body.genre,
            releaseDate: req.body.releaseDate,
            imageUrl: req.file ? '/img/' + req.file.filename : '/img/default.jpg',
        });

        newMovie.save()
            .then((movie) => {
                const movieWithImageUrl = {
                    ...movie._doc,
                    imageUrl: req.protocol + '://' + req.get('host') + movie.imageUrl
                };

                res.status(201).json(movieWithImageUrl);
            })
            .catch((error) => {
                res.status(500).json({ error: error.message });
            });
    });
};


// Actualizar una película existente
exports.updateMovie = (req, res) => {
    Movie.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((movie) => {
            if (!movie) {
                return res.status(404).json({ message: 'Película no encontrada' });
            }
            res.json(movie);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};

// Eliminar una película existente
exports.deleteMovie = (req, res) => {
    Movie.findByIdAndDelete(req.params.id)
        .then((movie) => {
            if (!movie) {
                return res.status(404).json({ message: 'Película no encontrada' });
            }
            res.json({ message: 'Película eliminada correctamente' });
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};