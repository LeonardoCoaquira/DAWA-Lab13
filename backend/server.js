const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const movieController = require('./controllers/movieController');
const path = require('path');

const app = express();
const port = 3000;

// Configuración de middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Conexión a la base de datos de MongoDB para películas
mongoose.connect('mongodb://127.0.0.1:27017/mymoviesdatabase', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conexión exitosa a la base de datos de películas');
    })
    .catch((error) => {
        console.log('Error al conectar a la base de datos de películas:', error);
    });

// Definir rutas para CRUD de películas
app.get('/api/movies', movieController.getMovies);
app.get('/api/movies/:id', movieController.getMovieById);
app.post('/api/movies', movieController.createMovie);
app.put('/api/movies/:id', movieController.updateMovie);
app.delete('/api/movies/:id', movieController.deleteMovie);

// Ruta para servir las imágenes
app.use('/img', express.static(path.join(__dirname, 'public', 'uploads')));

// Iniciar el servidor
app.listen(port, () => {
    console.log('Servidor backend en funcionamiento en el puerto', port);
});