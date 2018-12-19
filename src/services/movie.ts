import { injectable } from 'inversify';
import { Movie } from '../entities/movie';
import { getManager, getConnection } from 'typeorm';


@injectable()
export class MovieService {
  public newMovie(movie: Movie): void {
      // let newMovie: Movie = new Movie();
      // newMovie.title = movie.title
      getConnection().manager.save(movie);
  }
}