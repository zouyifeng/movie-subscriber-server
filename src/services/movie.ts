import { injectable } from 'inversify';
import { Movie } from '../entities/movie';
import { getManager, getConnection, Equal } from 'typeorm';
import { DBConnection } from '../DBConnection'


@injectable()
export class MovieService {
  public static async newMovie(movie: Movie): void {
      // let newMovie: Movie = new Movie();
      // newMovie.title = movie.title
      getConnection('movie').getRepository('movie').save(movie);
  }
  public static async findLastestMovie(): Promise<any> {
    const now = new Date()
    const nowStr = `${now.getFullYear()}-${now.getMonth()+1 < 10 ? '0' + now.getMonth()+1 : now.getMonth()+1}-${now.getDate()}`
    return getConnection('movie').getRepository('movie').find({
        create_time: Equal(nowStr)
      })
  }
}
