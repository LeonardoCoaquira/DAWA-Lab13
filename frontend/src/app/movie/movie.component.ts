import { Component, OnInit } from '@angular/core';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {
  movies: any[] = [];
  currentMovie: any = {};

  constructor(private movieService: MovieService) { }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.movieService.getMovies()
      .subscribe((movies) => {
        this.movies = movies;
      });
  }

  getMovieById(id: string): void {
    this.movieService.getMovieById(id)
      .subscribe((movie) => {
        this.currentMovie = movie;
      });
  }

  createMovie(movie: any): void {
    // Aquí debes agregar lógica para manejar el archivo de imagen.
    // Puedes utilizar el FormData para enviar archivos.

    const formData = new FormData();
    formData.append('title', movie.title);
    formData.append('description', movie.description);
    formData.append('director', movie.director);
    formData.append('genre', movie.genre);
    formData.append('releaseDate', movie.releaseDate);
    formData.append('image', movie.image);  // 'image' debe coincidir con el nombre en el backend

    this.movieService.createMovie(formData)
      .subscribe(() => {
        this.getMovies();
        this.currentMovie = {};
      });
  }

  updateMovie(id: string, movie: any): void {
    this.movieService.updateMovie(id, movie)
      .subscribe(() => {
        this.getMovies();
        this.currentMovie = {};
      });
  }

  deleteMovie(id: string): void {
    this.movieService.deleteMovie(id)
      .subscribe(() => {
        this.getMovies();
      });
  }

  editMovie(id: string): void {
    this.getMovieById(id);
  }

  handleImageChange(event: any): void {
    const file = event.target.files[0];
    this.currentMovie.image = file;
  }
}
