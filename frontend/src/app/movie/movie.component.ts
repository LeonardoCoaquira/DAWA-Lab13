import { Component, OnInit, ViewChild } from '@angular/core';
import { MovieService } from '../movie.service';
import { NgForm } from '@angular/forms';
import { Movie } from './movie.model';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {
  currentMovie: any = {};
  searchTerm = '';
  movies: Movie[] = [];
  newImage: any;

  isOperationSuccess = false;
  isOperationError = false;

  @ViewChild('formName') formName!: NgForm;
  isFormSubmitted = false;

  constructor(private movieService: MovieService) { }

  handleNewImageChange(event: any): void {
    const file = event.target.files[0];
    this.newImage = file;
  }

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
        this.currentMovie = { ...movie }; // Usar spread operator para crear una copia
      });
  }

  createMovie(movie: any): void {
    const formData = new FormData();
    formData.append('title', movie.title);
    formData.append('description', movie.description);
    formData.append('director', movie.director);
    formData.append('genre', movie.genre);
    formData.append('releaseDate', movie.releaseDate);
    formData.append('image', movie.image);

    this.movieService.createMovie(formData)
      .subscribe(
        () => {
          this.getMovies();
          this.currentMovie = {};
          this.isOperationSuccess = true;
          setTimeout(() => this.isOperationSuccess = false, 5000);
        },
        (error) => {
          console.error('Error creating movie:', error);
          this.isOperationError = true;
          setTimeout(() => this.isOperationError = false, 5000);
        }
      );
  }

  deleteMovie(id: string): void {
    this.movieService.deleteMovie(id)
      .subscribe(() => {
        this.getMovies();
      });
  }

  handleImageChange(event: any): void {
    const file = event.target.files[0];
    this.currentMovie.image = file;
  }

  onSubmit() {
    if (this.formName.valid && !this.isFormSubmitted) {
      this.isFormSubmitted = true;
      if (this.currentMovie._id) {
        // Lógica para actualizar si es necesario
        // Puedes agregar esto si lo necesitas en el futuro
      } else {
        // Solo crear, ya que no hay edición
        this.createMovie(this.currentMovie);
        this.formName.resetForm();
        this.isFormSubmitted = false;
      }
    }
  }

  resetForm() {
    this.formName.resetForm();
    this.formName.control.markAsUntouched({ onlySelf: true });
    this.formName.control.markAsPristine({ onlySelf: true });
  }

  confirmDeleteMovie(movieId: string): void {
    if (confirm("¿Estás seguro de que quieres eliminar esta película?")) {
      this.deleteMovie(movieId);
    }
  }

  get filteredMovies(): Movie[] {
    return this.movies.filter(movie =>
      movie.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      movie.director.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      movie.genre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}